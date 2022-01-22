import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 8080;

/* COMPONENTS */
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import homeRoute from './routes/homeRoute';
import fileRoute from './routes/fileRoute';
import connection from './config/connection';
import {authorize, checkUser} from './helpers/authorizeHelper';
import {upload} from './helpers/fileUploadHelper';

/* MIDDLEWARE */
app.use(cors());
app.use(bodyParser.json());
app.listen(PORT);

/* CONNECTION */
connection(app);

/* PUBLIC ROUTES */
app.use('/api/auth', authRoute);
app.use('/api/file', authorize, checkUser, upload.single('file'), fileRoute);

/* PRIVATE ROUTES */
app.use('/api/user', authorize, checkUser, userRoute);
app.use('/api/home', authorize, checkUser, homeRoute);
