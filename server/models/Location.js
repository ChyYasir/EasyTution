import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: String,
  color: {
    type: String,
    default: "#000000",
  },
  offerCount: {
    type: Number,
    default: 0,
  },
  availableOfferCount: {
    type: Number,
    default: 0,
  },
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
