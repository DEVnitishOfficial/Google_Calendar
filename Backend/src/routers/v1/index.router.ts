import express from 'express'
import pingRouter from './ping.router';
import eventRouter from './event.router';

const v1Router = express.Router();

v1Router.use('/ping',pingRouter)
v1Router.use("/event", eventRouter);


export default v1Router