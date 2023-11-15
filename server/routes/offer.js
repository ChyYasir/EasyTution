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
  updateReviews,
  updateTutorContacted,
} from "../controllers/offer.js";

const router = express.Router();

router
  .post("/add", addOffer)
  .get("/getAvailableOffers", getAvailableOffers)
  .get("/getOffer/:id", getOfferWithMatchedTutors)
  .delete("/available/delete/:id", deleteAvailableOffer)
  .get("/getPendingOffers", getPendingOffers)
  .get("/getConfirmedOffers", getConfirmedOffers)
  .get("/feedbackOffers", feedbackOffers)
  .put("/update/:id", updateOffer)
  .put("/:offerId/matchedTutors/:tutorId/contact", updateTutorContacted)
  .put("/confirm/update/:id", updateConfirmedOffer)
  .put("/updateReviews/:id", updateReviews);
export default router;
