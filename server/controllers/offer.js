import Analytics from "../models/Analytics.js";
import DailyData from "../models/DailyData.js";
import Guardian from "../models/Guardian.js";
import Location from "../models/Location.js";
import MonthlyData from "../models/MonthlyData.js";
import Offer from "../models/Offer.js";
import Tutor from "../models/Tutor.js";

const updateDailyData = async (status) => {
  try {
    let dailyData = await DailyData.findOne({
      date: new Date().toISOString().split("T")[0],
    });

    if (!dailyData) {
      dailyData = new DailyData({
        date: new Date().toISOString().split("T")[0],
        availableOffers: 0,
        pendingOffers: 0,
        confirmedOffers: 0,
      });
    }

    switch (status) {
      case "available":
        dailyData.availableOffers += 1;
        break;
      case "pending":
        dailyData.pendingOffers += 1;
        break;
      case "confirmed":
        dailyData.confirmedOffers += 1;
        break;
      // Add more cases if needed
      default:
        break;
    }

    await dailyData.save();
  } catch (error) {
    console.error("Error updating daily data:", error);
  }
};
export const addOffer = async (req, res) => {
  try {
    const offerData = req.body;
    console.log({ offerData });
    let analytics = await Analytics.findOne({ name: "analytics" });

    // check whether the guardian is present or not
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
    } else {
      analytics.numberOfRepeatedGuardians =
        analytics.numberOfRepeatedGuardians + 1;
    }
    const newOffer = new Offer(offerData);
    guardian.numberOfOffers = guardian.numberOfOffers + 1;

    // Define the query based on the offer class
    const matchQuery = {
      $and: [
        // Location matching
        { preferredLocations: { $in: newOffer.location } },
        // Class condition
        { upToClass: { $gte: newOffer.class } },
      ],
    };

    if (newOffer.class > 6) {
      matchQuery.$and.push(
        // Subjects matching
        { preferredSubjects: { $in: newOffer.subjects } }
      );
    }

    const matchedTutors = await Tutor.find(matchQuery);
    console.log({ matchedTutors });
    console.log({ newOffer });
    // Create the offer and add matched tutors with their contact status and scores
    newOffer.matchedTutors = matchedTutors.map((tutor) => {
      let score = 0;
      if (tutor.preferredLocations.includes(newOffer.location[0]))
        score += 4 * 2.5;
      if (
        newOffer.class <= 6 ||
        tutor.preferredSubjects.some((subject) =>
          newOffer.subjects.includes(subject)
        )
      )
        score += 3 * 2;
      if (tutor.upToClass >= newOffer.class) score += 2 * 1.5;
      if (tutor.gender === newOffer.tutorGender) score += 1 * 0.5;
      if (tutor.educationBoard === newOffer.educationBoard) score += 1 * 0.5;

      return {
        tutor: tutor._id,
        contacted: false,
        score: score,
      };
    });

    // guardian id into the offer
    newOffer.guardian = guardian._id;
    // push this offer into the guardian's offerlist
    guardian.offerList.push(newOffer._id);
    console.log(newOffer.matchedTutors);

    const location = await Location.findOne({ name: newOffer.location[0] });
    if (!location) {
      // Handle the case where the location is not found
      return res.status(400).json({ message: "Location not found" });
    }
    // increment location offercount
    location.offerCount = location.offerCount + 1;
    // increment location available offer count
    location.availableOfferCount = location.availableOfferCount + 1;

    analytics.totalNumberOfOffers = analytics.totalNumberOfOffers + 1;
    analytics.numberOfAvailableOffers = analytics.numberOfAvailableOffers + 1;
    await Promise.all([
      newOffer.save(),
      guardian.save(),
      location.save(),
      analytics.save(),
    ]);
    await updateDailyData("available");
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
export const feedbackOffers = async (req, res) => {
  try {
    let { start, size, filters, sorting, globalFilter } = req.query;

    let decodedFilterParam = decodeURIComponent(filters);
    filters = JSON.parse(decodedFilterParam);
    console.log({ filters });
    // Define your data retrieval logic using Mongoose (e.g., querying the Tutor collection)
    let dbData = await Offer.find({ status: "running" }).populate(
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
    const { status, assignedTutor, feeTaken, feePercentage, offerLocation } =
      req.body;

    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const location = await Location.findOne({ name: offer.location[0] });
    const analytics = await Analytics.findOne({ name: "analytics" });

    // Find or create MonthlyData for the current year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    let monthlyData = await MonthlyData.findOne({ year: currentYear });

    if (!monthlyData) {
      monthlyData = new MonthlyData({ year: currentYear, monthlyData: [] });
    }

    // Get the month data for the current month, or create a new one
    let monthData = monthlyData.monthlyData.find(
      (md) => md.month === currentMonth
    );
    if (!monthData) {
      monthData = {
        month: currentMonth,
        totalFeeTaken: 0,
        confirmedOffers: 0,
        pendingOffers: 0,
        maleTutors: 0,
        femaleTutors: 0,
      };
      monthlyData.monthlyData.push(monthData);
    }
    if (status) {
      offer.status = status;
      await updateDailyData(offer.status);
    }

    if (status === "pending") {
      monthData.pendingOffers += 1;
      location.availableOfferCount = location.availableOfferCount - 1;
      analytics.numberOfAvailableOffers = analytics.numberOfAvailableOffers - 1;
      analytics.numberOfPendingOffers = analytics.numberOfPendingOffers + 1;
    }
    if (status === "confirmed") {
      monthData.confirmedOffers += 1;
      offer.startDate = new Date();
      offer.feePercentage = feePercentage;
      const tutor = await Tutor.findById(assignedTutor);
      tutor.confirmedOffers.push({
        offerId: offer._id,
        location: offer.location,
        address: offer.address,
        salary: offer.salary,
        feePercentage: offer.feePercentage,
      });
      const createTime = new Date(offer.createdAt);
      const timeTakenToConfirm = offer.startDate - createTime;
      analytics.numberOfPendingOffers = analytics.numberOfPendingOffers - 1;
      analytics.numberOfConfirmedOffers = analytics.numberOfConfirmedOffers + 1;
      analytics.totalConfirmedTime =
        analytics.totalConfirmedTime + timeTakenToConfirm;
      await tutor.save();
    }
    if (status === "available") {
      const tutor = await Tutor.findById(offer.assignedTutor);
      location.availableOfferCount = location.availableOfferCount + 1;
      if (tutor.notConfirmedOffersCount) {
        tutor.notConfirmedOffersCount = tutor.notConfirmedOffersCount + 1;
      } else {
        tutor.notConfirmedOffersCount = 1;
      }
      analytics.numberOfAvailableOffers = analytics.numberOfAvailableOffers + 1;
      analytics.numberOfPendingOffers = analytics.numberOfPendingOffers - 1;
      await tutor.save();
    }
    offer.assignedTutor = assignedTutor;

    await Promise.all([
      monthlyData.save(),
      offer.save(),
      analytics.save(),
      location.save(),
    ]);
    res.json({ message: "Offer updated successfully", offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateConfirmedOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const { status, feeAmount } = req.body;

    console.log({ status });
    console.log({ feeAmount });
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    const analytics = await Analytics.findOne({ name: "analytics" });
    analytics.totalFeeTaken = analytics.totalFeeTaken + parseFloat(feeAmount);
    // update status to "running"
    offer.status = status;
    const currentDate = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonthIndex = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonthName = monthNames[currentMonthIndex];

    const data = await MonthlyData.findOne({ year: currentYear });

    if (data) {
      // Year exists, update or add monthly data for a specific month
      const foundMonth = data.monthlyData.find(
        (entry) => entry.month === currentMonthName
      );

      if (foundMonth) {
        // Month exists, update totalFeeTaken
        foundMonth.totalFeeTaken =
          foundMonth.totalFeeTaken + parseFloat(feeAmount);
      } else {
        // Month doesn't exist, add a new entry
        data.monthlyData.push({
          month: currentMonthName,
          totalFeeTaken: parseFloat(feeAmount),
        });
      }

      // Save the updated data
      await data.save();
    } else {
      // Year doesn't exist, create a new document
      const newMonthlyData = new MonthlyData({
        year: currentYear,
        monthlyData: [
          {
            month: currentMonthName,
            totalFeeTaken: feeAmount,
          },
        ],
      });

      // Save the new document
      await newMonthlyData.save();
    }
    await analytics.save();
    await offer.save();
    res.json({ message: "Fee Taken Succesffully for this offer" });
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

export const updateReviews = async (req, res) => {
  try {
    const offerId = req.params.id;
    const { stars, feedback } = req.body;

    // Validate input
    if (!stars || !feedback) {
      return res
        .status(400)
        .json({ error: "Stars and feedback are required." });
    }

    // Find the offer by ID
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found." });
    }

    // Update the reviews array with the new feedback
    offer.reviews.push({
      stars: stars,
      feedback: feedback,
      date: new Date(),
    });

    // console.log({ offer });
    const tutor = await Tutor.findById(offer.assignedTutor);

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found." });
    }

    tutor.reviews.push({
      offerId: offerId,
      stars: stars,
      feedback: feedback,
      date: new Date(),
    });
    tutor.totalStars = tutor.totalStars + stars;
    tutor.averageStars = tutor.totalStars / tutor.reviews.length;
    // Save the updated offer
    await offer.save();
    await tutor.save();

    res.status(200).json({ message: "Feedback updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
};
