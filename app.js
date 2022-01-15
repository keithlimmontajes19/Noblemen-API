import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

/* COMPONENTS */
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import connection from './config/connection';
import {authorize} from './helpers/authorizeHelper';

/* MIDDLEWARE */
app.use(cors());
app.use(bodyParser.json());

/* CONNECTION */
connection(app);

/* ROUTES */
app.use('/api/auth', authRoute);
app.use('/api/user', authorize, userRoute);
