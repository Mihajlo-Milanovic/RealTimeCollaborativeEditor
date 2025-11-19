import express from 'express';
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./routes/userRoutes";
import { port } from "./config/config";
import { connectDB } from "./config/db";
import {directoryRouter} from "./routes/directoryRoutes";
import {fileRouter} from "./routes/fileRoutes";
import {commentRouter} from "./routes/commentRoutes";
import {reactionRouter} from "./routes/reactionRoutes";
import cors from "cors";


const app = express();

app.use(cors({
  origin: "*", // "*" za sve domene
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(logger);
app.use(errorHandler);

app.use("/users", userRouter);
app.use("/directories", directoryRouter);
app.use("/files", fileRouter);
app.use("/comments", commentRouter);
app.use("/reactions", reactionRouter);

app.get('/',
    (req: express.Request, res: express.Response) => {
        res.send('Collaborative Editor Backend is running...').end();
    }
);

(async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})()