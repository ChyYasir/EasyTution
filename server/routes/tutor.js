import express from "express";
import {
  addTutor,
  getAllTutors,
  getTutor,
  updateTutor,
  updateTutorAvailability,
  updateTutorProfileInfo,
} from "../controllers/tutor.js";

const router = express.Router();

router
  .post("/add", addTutor)
  .get("/getAllTutors", getAllTutors)
  .get("/getTutor/:id", getTutor)
  .put("/update/:id", updateTutor)
  .put("/update/profile/:id", updateTutorProfileInfo)
  .put("/update/:tutorId/availablity", updateTutorAvailability);
export default router;
