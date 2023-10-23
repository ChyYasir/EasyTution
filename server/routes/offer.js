import express from "express";
import { addOffer } from "../controllers/offer.js";

const router = express.Router();

router.post("/add", addOffer);
export default router;
