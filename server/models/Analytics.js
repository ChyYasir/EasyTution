import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  totalFeeTaken: {
    type: Number,
    default: 0,
  },
  totalNumberOfOffers: {
    type: Number,
    default: 0,
  },
  numberOfAvailableOffers: {
    type: Number,
    default: 0,
  },
  numberOfPendingOffers: {
    type: Number,
    default: 0,
  },
  numberOfConfirmedOffers: {
    type: Number,
    default: 0,
  },
  totalConfirmedTime: {
    type: Number,
    default: 0,
  },
  numberOfRepeatedGuardians: {
    type: Number,
    default: 0,
  },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
