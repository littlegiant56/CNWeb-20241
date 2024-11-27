import express from 'express';
import cors from 'cors';
import { createServer } from "http";
import config from './config.js';
import route from './routes/index.js';
import configureSocket from './socket.js';

const app = express();
const httpServer = createServer(app);

const io = configureSocket(httpServer);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route init
route(app);

httpServer.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);

export default io;