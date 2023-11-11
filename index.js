//accessing & configuring environmental variables
const dotenv = require('dotenv');
dotenv.config();
//Accepting from unauthorized
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//variables
const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const useragent = require('express-useragent');
const swaggerUi = require("swagger-ui-express");
const yaml = require('js-yaml');
const fs = require('fs');

//using middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(useragent.express());
app.use(fileUpload({useTempFiles: true, limits: { fileSize: 50 * 1024 * 1024 * 1024 }}));
app.use(express.static(__dirname + '/public'));

//importing all required routes
const authRoutes = require('./src/routes/auth');
const roomRoutes = require('./src/routes/room');
const imageRoutes = require('./src/routes/image');
const reservationRoutes = require('./src/routes/reservation');
const bookingRoutes = require('./src/routes/booking');
const dashboardRoutes = require('./src/routes/dashboard');
const userRoutes = require('./src/routes/user');

// Parse YAML Swagger documentation to JSON
const swaggerFile = fs.readFileSync('./src/documentation/swagger.yaml', 'utf8');
const swaggerDocument = yaml.load(swaggerFile);

//using imported routes
app.use(process.env.ROUTE_PREFIX, authRoutes);
app.use(process.env.ROUTE_PREFIX, roomRoutes);
app.use(process.env.ROUTE_PREFIX, imageRoutes);
app.use(process.env.ROUTE_PREFIX, reservationRoutes);
app.use(process.env.ROUTE_PREFIX, bookingRoutes);
app.use(process.env.ROUTE_PREFIX, dashboardRoutes);
app.use(process.env.ROUTE_PREFIX, userRoutes);

// Serve Swagger documentation at /api/docs
app.use(process.env.API_DOCS_ROUTE_PREFIX, swaggerUi.serve);
app.get(process.env.API_DOCS_ROUTE_PREFIX, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`App successfully running on port ${port}`);
})