import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

/* COMPONENTS */
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import connection from './config/connection';
import {authorize} from './helpers/authorizeHelper';

/* CONNECTION */
connection(app);

/* MIDDLEWARE */
app.use(cors());
app.use(bodyParser.json());
app.listen(8000);

/* ROUTES */
app.use('/api/auth', authRoute);
app.use('/api/user', authorize, userRoute);
