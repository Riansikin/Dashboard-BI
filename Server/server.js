const express = require("express");
const app = express();
const cors = require("cors");
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const clearConsole = require('clear-console');



require('dotenv').config();
require('./config/db');

const PORT = process.env.PORT || 8080;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials : true, origin : process.env.ORIGIN}));

app.use(bodyParser.json());

app.use('/api/v1', routes);



app.listen(PORT, process.env.ORIGIN_IP,() => { 
    clearConsole();
    console.log(`Server is running on PORT http://${process.env.ORIGIN_IP}:${PORT}/api/v1`);
});

