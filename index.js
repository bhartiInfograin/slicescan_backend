const express = require('express');
const api = require('./router/contractRouter');
var bodyParser = require('body-parser');
const formData = require('express-form-data');

const app = express();


app.use(bodyParser.urlencoded({ extended: false  }))
app.use(bodyParser.json())
app.use(formData.parse());

app.use('/',api)





app.listen(5000,(error) => {
    if(error){
        console.log("error",error)
    }else{
        console.log("server is running on 5000")
    }
})