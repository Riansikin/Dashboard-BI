const mongoose = require('mongoose');
const url = process.env.MONGO_URL;

mongoose.connect(url)
        .then( () => {
            console.log('Tracking-Pemesanan-DB connected.....');
        })
        .catch( (err) => {
            console.log('Failed to connect DB : ', err);
        })