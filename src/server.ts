import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import * as exphbs from 'express-handlebars';
import methodOverride from 'method-override';
import { connectDB } from './config/database';

const app = express();
const PORT = 2000;

// Connect to MongoDB
connectDB();

const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: false,
  helpers: {
    eq: function (a: any, b: any) {
      return a == b;
    },
  },
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  methodOverride(function (req: any, res: any) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.get('/', (req: express.Request, res: express.Response) => {
  res.redirect('/auth/login');
});

// Import controllers
import authUsersController from './authUsers/authUsersController';
import appRealmController from './realms/appRealm/appRealmController';
import authRealmController from './realms/authServiceRealm/authRealmController';
import secretController from './realms/secrets/secretController';
import realmUsersController from './realms/realmUsers/realmUsersController';

// Routes
app.use('/auth', authUsersController);
app.use('/realms', appRealmController);
app.use('/realms/auth', authRealmController);
app.use('/secrets', secretController);
app.use('/realms/users', realmUsersController);

app.listen(PORT, () => {
  console.log(`app running on http://localhost:${PORT}`);
});
