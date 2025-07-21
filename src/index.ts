import express from "express";
import database from "./config/db.js";
import rootRouter from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;
//convert body to JSON
app.use(express.json());

// connect to mongoDB
database.connect();
// router
app.use("/api", rootRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
