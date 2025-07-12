import express from 'express';
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { userRoute } from "./routes/userRoutes";
import { port } from "./config/config";
import { connectDB } from "./config/db";
import {directoryRoute} from "./routes/directoryRoutes";
import {fileRoute} from "./routes/fileRoutes";
import {commentRoute} from "./routes/commentRoutes";



const app = express();

app.use(express.json());
app.use(logger)
app.use(errorHandler)

app.use("/user", userRoute);
app.use("/directory", directoryRoute);
app.use("/file", fileRoute);
app.use("/comment", commentRoute);

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