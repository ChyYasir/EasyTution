import express from "express";
import {
  addOffer,
  deleteAvailableOffer,
  feedbackOffers,
  getAvailableOffers,
  getConfirmedOffers,
  getOfferWithMatchedTutors,
  getPendingOffers,
  updateConfirmedOffer,
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
  .get("/feedbackOffers", feedbackOffers)
  .put("/update/:id", updateOffer)
  .put("/:offerId/matchedTutors/:tutorId/contact", updateTutorContacted)
  .put("/confirm/update/:id", updateConfirmedOffer);
export default router;
