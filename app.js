require('dotenv/config');

const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

/* COMPONENTS */
const authorize = require('./helpers/authorizeHelper');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');

/* CONNECTION */
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => app.listen(3001));

/* MIDDLEWARE */
app.use(cors())
app.use(bodyParser.json());

/* ROUTES */
app.use('/api/auth', authRoute);
app.use('/api/user', authorize(), userRoute);

