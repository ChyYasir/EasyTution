import Offer from "../models/Offer.js";
import Tutor from "../models/Tutor.js";

export const addOffer = async (req, res) => {
  try {
    const newOffer = new Offer(req.body);

    const matchedTutors = await Tutor.find({
      $and: [
        // Location matching
        { preferredLocations: { $in: newOffer.location } },

        // Subjects matching
        { preferredSubjects: { $in: newOffer.subjects } },

        // Education board matching
        { educationBoard: newOffer.educationBoard },

        // Gender matching
        { gender: newOffer.tutorGender },

        // Class condition
        { upToClass: { $gte: newOffer.class } },
      ],
    });

    // Create the offer and add matched tutors with their contact status
    newOffer.matchedTutors = matchedTutors.map((tutor) => ({
      tutor: tutor._id,
      contacted: false, // Set to true if contacted
    }));
    await newOffer.save();
    res.status(201).json({ message: "Offer added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
