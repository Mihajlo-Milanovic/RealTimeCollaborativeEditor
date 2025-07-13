import express from 'express';
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./routes/userRoutes";
import { port } from "./config/config";
import { connectDB } from "./config/db";
import {directoryRouter} from "./routes/directoryRoutes";
import {fileRouter} from "./routes/fileRoutes";
import {commentRouter} from "./routes/commentRoutes";



const app = express();

app.use(express.json());
app.use(logger);
app.use(errorHandler);

app.use("/user", userRouter);
app.use("/directory", directoryRouter);
app.use("/file", fileRouter);
app.use("/comment", commentRouter);

app.get('/',
    (req, res) => {
        res.send('Collaborative Editor Backend is running')
    }
);

(async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})()