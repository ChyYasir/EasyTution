import express from "express";
import {
  addSubject,
  deleteSubject,
  getAllSubjects,
} from "../controllers/system.js";

const router = express.Router();

router
  .post("/subject/add", addSubject)
  .get("/subject/getAll", getAllSubjects)
  .delete("/subject/delete/:id", deleteSubject);
export default router;
