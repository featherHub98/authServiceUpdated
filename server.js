require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.use("/auth",require('./authUsers/authUsersController'));







app.listen(process.env.PORT,()=>{
    console.log(`app running on http://localhost:${process.env.PORT}`);
})