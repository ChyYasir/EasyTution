import express from "express";
import {
  addTutor,
  getAllTutors,
  getTutor,
  updateTutor,
} from "../controllers/tutor.js";

const router = express.Router();

router
  .post("/add", addTutor)
  .get("/getAllTutors", getAllTutors)
  .get("/getTutor/:id", getTutor)
  .put("/update/:id", updateTutor);
export default router;
