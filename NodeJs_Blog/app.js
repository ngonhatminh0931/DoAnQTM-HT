
require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');


const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const contactRoutes = require('./server/routes/contact');




const app = express();
const PORT = process.env.PORT || 5000;



// Connect to db
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));




app.use(contactRoutes);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));


app.use(express.static('public'));

//templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute; 


// Trong app.js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.locals.currentRoute = req.originalUrl;
  next();
});


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));



app.use(contactRoutes);


app.get('/', (req, res) => {
  res.render('home');  // Không cần truyền currentRoute nữa
});

app.get('/about', (req, res) => {
  res.render('about');  // Không cần truyền currentRoute nữa
});

app.get('/contact', (req, res) => {
  res.render('contact');  // Không cần truyền currentRoute nữa
});






app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

