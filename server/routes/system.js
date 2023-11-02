import express from "express";
import {
  addSubject,
  deleteSubject,
  getAllSubjects,
} from "../controllers/system.js";
import {
  addLocation,
  deleteLocation,
  getAllLocations,
} from "../controllers/location.js";

const router = express.Router();

router
  .post("/subject/add", addSubject)
  .get("/subject/getAll", getAllSubjects)
  .delete("/subject/delete/:id", deleteSubject)
  .post("/location/add", addLocation)
  .get("/location/getAll", getAllLocations)
  .delete("/location/delete/:id", deleteLocation);
export default router;
