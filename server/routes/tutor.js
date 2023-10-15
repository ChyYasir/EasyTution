import express from "express";
import { addTutor, getTutors } from "../controllers/tutor.js";

const router = express.Router();

router.post("/add", addTutor).get("/getAllTutors", getTutors);
export default router;
