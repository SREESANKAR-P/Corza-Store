
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/project")

const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const cookieParser = require('cookie-parser');
const nocache = require('nocache');
const session = require('express-session');
const config = require('./config/config')
const logger = require('morgan');


app.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: true }));
app.use(express.static('public'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(nocache()); // to clear cache
// app.use(function (req, res, next) {
//   res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//   next();
// });
app.use(logger('dev'));

// for css
app.use(express.static(__dirname + '/public'));

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs")

//PARTIALS ROUTE SETTING
const partialsPath = path.join(__dirname + "/views/partials");
hbs.registerPartials(partialsPath);


hbs.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});


hbs.registerHelper('ifnoteq', function (a, b, options) {
  if (a != b) { return options.fn(this); }
  return options.inverse(this);
});


hbs.registerHelper("for", function (from, to, incr, block) {
  let accum = "";
  for (let i = from; i <= to; i += incr) {
    accum += block.fn(i);
  }
  return accum;

})


hbs.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn ? options.fn(this) : options.fn;
  } else {
    return options.inverse ? options.inverse(this) : options.inverse
  }
})


//setting routes
const adminRouter = require("./routes/adminRoute");
const userRouter = require("./routes/userRoute");
const { dbConnect } = require("./config/db");

// main Routes
app.use('/', userRouter); //for user Routes
app.use('/admin', adminRouter); //for admin Routes


// app.get('*',function(req,res){
//     res.redirect('/home')
//   })

// PORT SETTING
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server Runnig in http://localhost:4000");
})  
