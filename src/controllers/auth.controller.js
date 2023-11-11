const db = require('../utils/dbConfig');
const util = require('util');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {
    signUp: async (req, res) => {
        const now = Math.floor(Date.now() / 1000);
        const {
            user_firstname,
            user_lastname,
            user_email,
            user_phone,
            password
        } = req.body;

        const connection = await util.promisify(db.getConnection).bind(db)();
    
        try
        {
            const encPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET).toString();

            //check if email already exists
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_email = ? LIMIT 1", [ user_email ]);

            if(users.length > 0)
            {
                throw new Error('Preffered email already exists');
            }

            let query = `INSERT INTO users 
                (
                    user_firstname, 
                    user_lastname, 
                    user_email, 
                    user_phone,
                    plain_password, 
                    enc_password, 
                    user_created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const queryParams = [user_firstname, user_lastname, user_email, user_phone, password, encPassword, now];

            await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error:false,
                message:`Sign Up completed`
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    login: async (req, res) => {
        const { 
            email, 
            password 
        } = req.body;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const rows = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_email = ? LIMIT 1", [email]);

            if(rows.length == 0)
            {
                throw new Error("Invalid credentials");
            }

            const user = rows[0];

            const decryptedPassword = CryptoJS.AES.decrypt(user.enc_password, process.env.CRYPTOJS_SECRET);
            const decryptedPasswordToString = decryptedPassword.toString(CryptoJS.enc.Utf8);

            if(decryptedPasswordToString !== password)
            {
                throw new Error('Invalid credentials')
            }

            if(user.user_status == "Inactive")
            {
                throw new Error('Sorry!!! Your account is currently inactive. Please contact administrator')
            }

            //destructure user object to remove passwords
            const { enc_password, plain_password, ...rest } = user;

            const token = jwt.sign(
                rest,
                process.env.JWT_SECRET,
                {
                    expiresIn: 60 * 60 * 24 * 7
                }
            );

            res.json({
                error:false,
                user:rest,
                token
            });
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    updateAccount: async (req, res) => {
        const myData = req.userDecodedData;
        const { 
            user_firstname, 
            user_lastname, 
            user_email, 
            user_phone, 
        } = req.body;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_email = ? AND user_id != ? LIMIT 1", [user_email, myData.user_id]);

            if(users.length > 0)
            {
                throw new Error('Email already exists. Please choose another');
            }
            
            let updateQuery = `
                UPDATE users 
                SET 
                    user_firstname = ?, 
                    user_lastname = ?, 
                    user_email = ?, 
                    user_phone = ?
                WHERE 
                    user_id = ?
            `;

            const updateQueryParams = [ user_firstname, user_lastname, user_email, user_phone, myData.user_id ];

            await util.promisify(connection.query).bind(connection)(updateQuery, updateQueryParams);

            let tkn = jwt.sign(
                {
                    user_id: myData.user_id,
                    user_firstname,
                    user_lastname,
                    user_email,
                    user_phone,
                    user_role: myData.user_role,
                    user_created_at: myData.user_created_at,
                    user_status:myData.user_status
                }, process.env.JWT_SECRET, { expiresIn: 60 * 60 }
            );

            res.json({
                error:false,
                message:'Account updated successfully',
                token:tkn
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    updatePassword: async (req, res) => {
        const myData = req.userDecodedData;
        const email = myData.user_email;
        const { current_password, new_password } = req.body;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const users = await util.promisify(connection.query).bind(connection)("SELECT * FROM users WHERE user_email = ? LIMIT 1", [email]);

            if(users.length == 0)
            {
                throw new Error('Your account no longer exists');
            }

            const user = users[0];

            const decryptedPassword = CryptoJS.AES.decrypt(user.enc_password, process.env.CRYPTOJS_SECRET);
            const decryptedPasswordToString = decryptedPassword.toString(CryptoJS.enc.Utf8);

            if(decryptedPasswordToString !== current_password)
            {
                throw new Error('Password provided does not match your stored password. Try Again');
            }
                        
            const encryptedPassword = CryptoJS.AES.encrypt(new_password, process.env.CRYPTOJS_SECRET).toString();

            await util.promisify(connection.query).bind(connection)("UPDATE users SET plain_password = ?, enc_password = ? WHERE user_email = ?", [new_password, encryptedPassword, email]);

            res.json({
                error:false,
                message:'Password updated successfully'
            })
                
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
}