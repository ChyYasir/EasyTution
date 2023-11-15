import express from "express";
import {
  addTutor,
  getAllTutors,
  getTutor,
  updateTutor,
  updateTutorProfileInfo,
} from "../controllers/tutor.js";

const router = express.Router();

router
  .post("/add", addTutor)
  .get("/getAllTutors", getAllTutors)
  .get("/getTutor/:id", getTutor)
  .put("/update/:id", updateTutor)
  .put("/update/profile/:id", updateTutorProfileInfo);
export default router;
