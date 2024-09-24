import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './api/routes';
import bodyParser from 'body-parser';
import {populateDatabase} from './populateDB';

import passport from "passport";
import "./utils/auth/auth.handlers";


const app = express();

//populateDatabase();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use('/api', apiRouter);


export default app;