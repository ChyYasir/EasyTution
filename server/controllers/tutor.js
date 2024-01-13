import Offer from "../models/Offer.js";
import Tutor from "../models/Tutor.js";

export const addTutor = async (req, res) => {
  try {
    const newTutor = new Tutor(req.body);
    await newTutor.save();

    // Find offers that match the tutor's criteria
    const matchingOffers = await Offer.find({
      $and: [
        // Location matching
        { location: { $in: newTutor.preferredLocations } },

        // Subjects matching
        { subjects: { $in: newTutor.preferredSubjects } },

        // Education board matching
        { educationBoard: newTutor.educationBoard },

        // Gender matching
        { tutorGender: newTutor.gender },

        // Class condition
        { class: { $lte: newTutor.upToClass } },
      ],
    });

    // Add the new tutor to the matchedTutors array of each matching offer
    const updatePromises = matchingOffers.map(async (offer) => {
      offer.matchedTutors.push({
        tutor: newTutor._id,
        contacted: false, // Set to true if contacted
      });
      await offer.save();
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    res.status(201).json({ message: "Tutor added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTutors = async (req, res) => {
  try {
    let { start, size, filters, sorting, globalFilter } = req.query;

    let decodedFilterParam = decodeURIComponent(filters);
    filters = JSON.parse(decodedFilterParam);

    // Define your data retrieval logic using Mongoose (e.g., querying the Tutor collection)
    let dbData = await Tutor.find().exec();
    // Apply filters
    if (filters) {
      let parsedColumnFilters = filters;
      if (parsedColumnFilters && parsedColumnFilters.length) {
        parsedColumnFilters.forEach((filter) => {
          const { id: columnId, value: filterValue } = filter;
          dbData = dbData.filter((row) =>
            row[columnId]
              .toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          );
        });
      }
    }

    // Apply global filter
    if (globalFilter) {
      dbData = dbData.filter((row) =>
        Object.keys(row).some((columnId) =>
          row[columnId]
            .toString()
            .toLowerCase()
            .includes(globalFilter.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sorting) {
      const parsedSorting = JSON.parse(sorting);
      if (parsedSorting && parsedSorting.length) {
        const sort = parsedSorting[0];
        const { id, desc } = sort;
        dbData.sort((a, b) => {
          if (desc) {
            return a[id] < b[id] ? 1 : -1;
          }
          return a[id] > b[id] ? 1 : -1;
        });
      }
    }

    // // Send the paginated data and total row count as a response
    const totalRowCount = dbData.length;
    const data = dbData.slice(start, start + size);

    res.status(200).json({ data, meta: { totalRowCount } });
  } catch (error) {
    console.error({ error: error.message });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTutor = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("hello");
    const tutor = await Tutor.findById(id);
    res.status(200).json(tutor);
  } catch (error) {
    console.error({ error: error.message });
    res.status(404).json({ message: error.message });
  }
};
export const updateTutor = async (req, res) => {
  try {
    const tutorId = req.params.id; // Get the tutor's ID from the request parameters
    const updatedFields = req.body;

    // Find the tutor by ID and update the specified fields using async/await

    const updatedTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedTutor) {
      console.error("Tutor not found");
      res.status(404).json({ error: "Tutor not found" });
      return;
    }
    // console.log({ updatedTutor });
    res.status(200).json(updatedTutor);
  } catch (err) {
    console.error("Error updating tutor:", err);
    res.status(500).json({ error: "Error updating tutor" });
  }
};

export const updateTutorProfileInfo = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const updatedFields = req.body;

    // Find the tutor by ID and update the specified fields
    const updatedTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedTutor) {
      console.error("Tutor not found");
      res.status(404).json({ error: "Tutor not found" });
      return;
    }

    // Find offers that match the updated tutor's criteria
    const matchingOffers = await Offer.find({
      $and: [
        { location: { $in: updatedTutor.preferredLocations } },
        { subjects: { $in: updatedTutor.preferredSubjects } },
        { educationBoard: updatedTutor.educationBoard },
        { tutorGender: updatedTutor.gender },
        { class: { $lte: updatedTutor.upToClass } },
      ],
    });

    // Find the previously matched offers (before the update)
    const previouslyMatchedOffers = await Offer.find({
      "matchedTutors.tutor": updatedTutor._id,
    });
    // Remove the tutor from previously matched offers
    const removePromises = previouslyMatchedOffers.map(async (offer) => {
      offer.matchedTutors = offer.matchedTutors.filter(
        (match) => match.tutor.toString() !== updatedTutor._id.toString()
      );
      await offer.save();
    });

    // Update the matchedTutors array of each matching offer
    const updatePromises = matchingOffers.map(async (offer) => {
      const existingMatch = offer.matchedTutors.find(
        (match) => match.tutor.toString() === updatedTutor._id.toString()
      );

      if (!existingMatch) {
        // If the tutor is not already in matchedTutors, add them
        offer.matchedTutors.push({
          tutor: updatedTutor._id,
          contacted: false, // Set to true if contacted
        });
        await offer.save();
      }
    });

    // // Wait for all updates and removals to complete
    await Promise.all([...updatePromises, ...removePromises]);

    res.status(200).json(updatedTutor);
  } catch (err) {
    console.error("Error updating tutor:", err);
    res.status(500).json({ error: "Error updating tutor" });
  }
};
export const getTutorAvailability = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    res.json(tutor.availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
export const updateTutorAvailability = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const updatedAvailability = req.body;

    const tutor = await Tutor.findByIdAndUpdate(
      tutorId,
      { $set: { availability: updatedAvailability } },
      { new: true }
    );

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    res.json(tutor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
