import 'colors';
import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import passportConfig from './server/config/passport';

// configure dotenv
dotenv.config();
// Set up the express app
const app = express();

const port = process.env.PORT || 7000;


app.use(cors());
// setup passport authentication
passportConfig(passport);
app.use(passport.initialize());

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup expressValidator Middleware
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += `[${namespace.shift()}]`;
    }
    return {
      param: formParam,
      msg,
      value
    };
  }
}));

const setHeaders = () => (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:5000');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
};


app.use(setHeaders());

// Require our routes into the application.
require('./server/routes')(app);

module.exports = app;

app.listen(port, () => {
  console.log(`Magic happening at: ${port}`.green);
});
