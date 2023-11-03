import Guardian from "../models/Guardian.js";
import Offer from "../models/Offer.js";
import Tutor from "../models/Tutor.js";

export const addOffer = async (req, res) => {
  try {
    const offerData = req.body;

    let guardian = await Guardian.findOne({
      guardianPhoneNumber: offerData.guardianPhoneNumber,
    });

    if (!guardian) {
      guardian = new Guardian({
        guardianName: offerData.guardianName,
        guardianPhoneNumber: offerData.guardianPhoneNumber,
        location: offerData.location,
        address: offerData.address,
        offerList: [],
      });
    }
    const newOffer = new Offer(offerData);

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
      tutor: tutor,
      contacted: false, // Set to true if contacted
    }));
    // const result = await newOffer.populate("Tutor");
    // console.log(result);
    newOffer.guardian = guardian._id;
    guardian.offerList.push(newOffer._id);
    await Promise.all([newOffer.save(), guardian.save()]);
    // await newOffer.save();
    res.status(201).json({ message: "Offer added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAvailableOffers = async (req, res) => {
  try {
    let { start, size, filters, sorting, globalFilter } = req.query;

    let decodedFilterParam = decodeURIComponent(filters);
    filters = JSON.parse(decodedFilterParam);

    // Define your data retrieval logic using Mongoose (e.g., querying the Tutor collection)
    let dbData = await Offer.find({ status: "available" }).exec();
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
export const getPendingOffers = async (req, res) => {
  try {
    let { start, size, filters, sorting, globalFilter } = req.query;

    let decodedFilterParam = decodeURIComponent(filters);
    filters = JSON.parse(decodedFilterParam);
    console.log({ filters });
    // Define your data retrieval logic using Mongoose (e.g., querying the Tutor collection)
    let dbData = await Offer.find({ status: "pending" }).populate(
      "assignedTutor"
    );
    // console.log(dbData);
    // dbData.map((e) => {
    //   console.log(e.assignedTutor);
    // });
    // console.log(JSON.parse(dbData.assignedTutor));
    // Apply filters
    if (filters) {
      let parsedColumnFilters = filters;
      if (parsedColumnFilters && parsedColumnFilters.length) {
        parsedColumnFilters.forEach((filter) => {
          const { id: columnId, value: filterValue } = filter;
          console.log({ columnId });
          dbData = dbData.filter((row) => {
            if (columnId.includes("assignedTutor")) {
              // console.log("Tutor");

              return row?.assignedTutor[columnId.split(".")[1]]
                .toString()
                .toLowerCase()
                .includes(filterValue.toLowerCase());
            } else {
              // console.log("guardian");
              return row[columnId]
                .toString()
                .toLowerCase()
                .includes(filterValue.toLowerCase());
            }
          });
          console.log(dbData);
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
export const getConfirmedOffers = async (req, res) => {
  try {
    let { start, size, filters, sorting, globalFilter } = req.query;

    let decodedFilterParam = decodeURIComponent(filters);
    filters = JSON.parse(decodedFilterParam);
    console.log({ filters });
    // Define your data retrieval logic using Mongoose (e.g., querying the Tutor collection)
    let dbData = await Offer.find({ status: "confirmed" }).populate(
      "assignedTutor"
    );
    // console.log(dbData);
    // dbData.map((e) => {
    //   console.log(e.assignedTutor);
    // });
    // console.log(JSON.parse(dbData.assignedTutor));
    // Apply filters
    if (filters) {
      let parsedColumnFilters = filters;
      if (parsedColumnFilters && parsedColumnFilters.length) {
        parsedColumnFilters.forEach((filter) => {
          const { id: columnId, value: filterValue } = filter;
          console.log({ columnId });
          dbData = dbData.filter((row) => {
            if (columnId.includes("assignedTutor")) {
              // console.log("Tutor");

              return row?.assignedTutor[columnId.split(".")[1]]
                .toString()
                .toLowerCase()
                .includes(filterValue.toLowerCase());
            } else {
              // console.log("guardian");
              return row[columnId]
                .toString()
                .toLowerCase()
                .includes(filterValue.toLowerCase());
            }
          });
          console.log(dbData);
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

export const getOfferWithMatchedTutors = async (req, res) => {
  const offerId = req.params.id; // Extract the offer ID from the request parameters

  try {
    const offer = await Offer.findOne({ _id: offerId }).populate(
      "matchedTutors.tutor"
    ); // Populate the 'tutor' field in 'matchedTutors'

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Send the offer with populated matchedTutors as the response
    res.status(200).json(offer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAvailableOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    console.log({ offerId });
    // Check if the offer with the specified ID exists
    const offer = await Offer.findById(offerId);
    console.log(offer);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // If the offer exists, delete it
    await Offer.findByIdAndRemove(offerId);

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const { status, assignedTutor } = req.body;

    // Find the offer by ID

    console.log(offerId);
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    console.log({ status });
    console.log({ assignedTutor });
    // Update the status and assigned tutor
    if (status) {
      offer.status = status;
    }

    offer.assignedTutor = assignedTutor;
    if (status === "confirmed") {
      offer.startDate = new Date();
    }
    console.log({ offer });
    // Save the updated offer
    await offer.save();

    res.json({ message: "Offer updated successfully", offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTutorContacted = async (req, res) => {
  try {
    const { offerId, tutorId } = req.params;

    const updatedOffer = await Offer.findOneAndUpdate(
      {
        _id: offerId,
        "matchedTutors.tutor": tutorId,
      },
      { $set: { "matchedTutors.$.contacted": true } },
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer or tutor not found" });
    }

    res.json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: "Error updating tutor contact", error });
  }
};
