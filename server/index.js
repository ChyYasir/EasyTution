import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { join } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import tutorRoutes from "./routes/tutor.js";
import offerRoutes from "./routes/offer.js";
import systemRoutes from "./routes/system.js";
import guardianRoutes from "./routes/guardian.js";
/*CONFIGURATION*/
dotenv.config();
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// // Serve static files from the 'build' directory inside the 'client' folder
// app.use(express.static(path.join(__dirname, "client/build")));

// // Handle requests to the '/*' route by serving the 'index.html' file
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build/index.html"));
// });

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    // origin: "https://easy-tution.onrender.com",
    origin: "*",
  })
);

/* ROUTES */
app.use("/tutor", tutorRoutes);
app.use("/offer", offerRoutes);
app.use("/system", systemRoutes);
app.use("/guardian", guardianRoutes);
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
