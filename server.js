const path = require('path');
require('dotenv');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
    secret: process.env.SESS_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({helpers});
const PORT = process.env.PORT || 3001;

// use handlebars for views
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // path to static css and js files
// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false})
.then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});