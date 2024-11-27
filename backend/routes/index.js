import userRoute from './userRoute.js';
import postRoute from "./postRoute.js";
import chatRoute from "./chatRoute.js";

export default function route(app) {
    app.use('/', userRoute);
    app.use('/', postRoute);
    app.use('/', chatRoute);
}