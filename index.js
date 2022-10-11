const express = require('express');
const api = require('./router/contractRouter');
var bodyParser = require('body-parser');
const formData = require('express-form-data');
const dotenv = require("dotenv");
var cors = require('cors');

dotenv.config()


const app = express();


app.use(bodyParser.urlencoded({ extended: false  }))
app.use(bodyParser.json())
app.use(formData.parse());
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/',api)



const PORT = process.env.PORT || 2000


app.listen(PORT,(error) => {
    if(error){
        console.log("error",error)
    }else{
        console.log("server is running on:",PORT)
    }
})