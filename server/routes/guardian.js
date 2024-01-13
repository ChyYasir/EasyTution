import express from "express";
import { getAllGuardians } from "../controllers/guardian.js";

const router = express.Router();

router.get("/getAllGuardians", getAllGuardians);

export default router;
