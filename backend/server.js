var express = require('express');
var path = require('path')
var dotenv=require('dotenv');
var morgan = require('morgan');

const app = express();

dotenv.config();

const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});