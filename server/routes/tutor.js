import express from "express";
import { addTutor, getAllTutors, getTutor } from "../controllers/tutor.js";

const router = express.Router();

router
  .post("/add", addTutor)
  .get("/getAllTutors", getAllTutors)
  .get("/getTutor/:id", getTutor);
export default router;
