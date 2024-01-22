import express from "express";
import {
  addTutor,
  getAllTutors,
  getTutor,
  getTutorAvailability,
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
  .put("/update/availability/:tutorId", updateTutorAvailability)
  .get("/:tutorId/availability", getTutorAvailability);

export default router;
