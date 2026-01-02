require('dotenv').config();
const express = require('express');
const cors = require('cors');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const PORT = 2000;




app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: false
}));
app.set('view engine', 'hbs');
app.set('views', './views');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
   
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.get('/', (req, res) => {
    res.redirect('/auth/users');
});
app.use("/auth",require('./authUsers/authUsersController'));
app.use("/realms",require('./realms/appRealm/appRealmController'));
app.use("/realms/auth",require('./realms/authServiceRealm/authRealmController'));
app.use("/secrets",require('./realms/secrets/secretController'));
app.use("/realms/users",require('./realms/realmUsers/realmUsersController'));






app.listen(PORT,()=>{
    console.log(`app running on http://localhost:${PORT}`);
})