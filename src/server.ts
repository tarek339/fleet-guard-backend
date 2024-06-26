import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { router as company } from "./routes/company";
import { router as admin } from "./routes/admin";
import { router as driver } from "./routes/driver";
import { router as truck } from "./routes/truck";
import { router as trailer } from "./routes/trailer";
import {
  loopDrivers,
  pushDriverEmail,
} from "./controllers/drivers/driverOperation";
import {
  loopTrailers,
  pushTrailerEmail,
} from "./controllers/trailers/trailerOperation";
import {
  loopTrucks,
  pushTruckEmail,
} from "./controllers/trucks/truckOperation";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/company", company);
app.use("/admin", admin);
app.use("/driver", driver);
app.use("/truck", truck);
app.use("/trailer", trailer);

const runTrailerOperations = async () => {
  await loopTrailers();
  pushTrailerEmail();
};
const runTruckOperations = async () => {
  await loopTrucks();
  pushTruckEmail();
};
const runDriverOperations = async () => {
  await loopDrivers();
  pushDriverEmail();
};

// setInterval(() => {
//   runTrailerOperations();
// }, 86400);
// setInterval(() => {
//   runTruckOperations();
// }, 86400);
// setInterval(() => {
//   runDriverOperations();
// }, 86400);

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT!);
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
    app.get("/", (req, res) => {
      res.send("Backend and DB connected");
    });
  } catch (error) {
    console.log(
      "Internet connection Error! Not able to connect with Data base!"
    );
  }
};

connect();
