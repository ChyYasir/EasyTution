import express from "express";
import {
  addLocation,
  addSubject,
  deleteLocation,
  deleteSubject,
  getAllLocations,
  getAllSubjects,
  updateLocation,
} from "../controllers/system.js";

const router = express.Router();

router
  .post("/subject/add", addSubject)
  .get("/subject/getAll", getAllSubjects)
  .delete("/subject/delete/:id", deleteSubject)
  .post("/location/add", addLocation)
  .get("/location/getAll", getAllLocations)
  .delete("/location/delete/:id", deleteLocation)
  .put("/location/update/:id", updateLocation);
export default router;
