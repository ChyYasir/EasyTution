import express from "express";
import {
  addOffer,
  deleteAvailableOffer,
  getAvailableOffers,
  getOfferWithMatchedTutors,
} from "../controllers/offer.js";

const router = express.Router();

router
  .post("/add", addOffer)
  .get("/getAvailableOffers", getAvailableOffers)
  .get("/getAvailableOffer/:id", getOfferWithMatchedTutors)
  .delete("/available/delete/:id", deleteAvailableOffer);
export default router;
