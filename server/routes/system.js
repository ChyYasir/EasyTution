import express from "express";
import {
  addAnalytics,
  addLocation,
  addSubject,
  deleteLocation,
  deleteSubject,
  getAllLocations,
  getAllSubjects,
  getAnalytics,
  getAvailableYears,
  getDailyDataByDateRange,
  getMonthlyDataByYear,
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
  .put("/location/update/:id", updateLocation)
  .post("/analytics/add", addAnalytics)
  .get("/analytics/get", getAnalytics)
  .get("/monthlyData/get/:year", getMonthlyDataByYear)
  .get("/getAvailableYears", getAvailableYears)
  .get("/dailyData/:startDate/:endDate", getDailyDataByDateRange);
export default router;
