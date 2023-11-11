var Service = require('node-windows').Service;
var svc = new Service({
        name:'Hotel Booking API Service & Management',
        description:'An API backend service for Hotel Booking Services & Management',
        script:'C:\\Users\\Administrator\\projects\\nodejs\\h\\index.js'
});

svc.on('start', function(){
        console.log('Hotel Booking API backend service started successfully');
})

svc.start();
