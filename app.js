const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

/* COMPONENTS */
// import userRoute from './routes/userRoute';
// import authRoute from './routes/authRoute';
// import connection from './config/connection';
// import {authorize} from './helpers/authorizeHelper';

/* CONNECTION */
// connection(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT);

/* MIDDLEWARE */
app.use(cors());
app.use(bodyParser.json());

app.get('/api/test', (req, res) => {
    res.send('hi');
});
/* ROUTES */
// app.use('/api/auth', authRoute);
// app.use('/api/user', authorize, userRoute);
