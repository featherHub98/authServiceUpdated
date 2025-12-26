require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 2000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth",require('./authUsers/authUsersController'));
app.use("/realms",require('./realms/appRealm/appRealmController'));
app.use("/realms/auth",require('./realms/authRealm/authRealmController'));

app.listen(PORT,()=>{
    console.log(`app running on http://localhost:${PORT}`);
})