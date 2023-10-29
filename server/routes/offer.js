import express from "express";
import {
  addOffer,
  deleteAvailableOffer,
  getAvailableOffers,
  getConfirmedOffers,
  getOfferWithMatchedTutors,
  getPendingOffers,
  updateOffer,
  updateTutorContacted,
} from "../controllers/offer.js";

const router = express.Router();

router
  .post("/add", addOffer)
  .get("/getAvailableOffers", getAvailableOffers)
  .get("/getAvailableOffer/:id", getOfferWithMatchedTutors)
  .delete("/available/delete/:id", deleteAvailableOffer)
  .get("/getPendingOffers", getPendingOffers)
  .get("/getConfirmedOffers", getConfirmedOffers)
  .put("/update/:id", updateOffer)
  .put("/:offerId/matchedTutors/:tutorId/contact", updateTutorContacted);
export default router;
