// models/DailyData.js
import mongoose from "mongoose";

const dailyDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  availableOffers: {
    type: Number,
    default: 0,
  },
  pendingOffers: {
    type: Number,
    default: 0,
  },
  confirmedOffers: {
    type: Number,
    default: 0,
  },
});

const DailyData = mongoose.model("DailyData", dailyDataSchema);

export default DailyData;
