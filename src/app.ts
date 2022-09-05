import express from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/index";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("server running on PORT " + PORT);
});
