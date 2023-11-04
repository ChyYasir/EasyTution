import Location from "../models/Location.js";
import Subject from "../models/Subject.js";

export const addSubject = async (req, res) => {
  try {
    const newSubject = new Subject(req.body);

    const subject = await Subject.findOne({ name: newSubject.name });
    if (subject) {
      return res.json({ message: "This Subject is already in the list" });
    }
    const savedSubject = await newSubject.save();
    res.json({ data: savedSubject, message: "Subject Added Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add a subject" });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const allSubjects = await Subject.find().exec();
    console.log(allSubjects);
    res.status(200).json(allSubjects);
  } catch (error) {
    res.status(500).json({ error: "Failed load all subjects" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    // Check if the offer with the specified ID exists
    const subject = await Subject.findById(subjectId);
    //   console.log(offer);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // If the offer exists, delete it
    await Subject.findByIdAndRemove(subjectId);

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addLocation = async (req, res) => {
  try {
    const newLocation = new Location(req.body);

    const location = await Location.findOne({ name: newLocation.name });

    if (location) {
      return res.json({ message: "This location is already in the list" });
    }
    const savedLocation = await newLocation.save();
    res.json({ data: savedLocation, message: "Location added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add a location" });
  }
};

export const getAllLocations = async (req, res) => {
  try {
    const allLocations = await Location.find().exec();
    // console.log(allLocations);
    res.status(200).json(allLocations);
  } catch (error) {
    res.status(500).json({ error: "Failed load all subjects" });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const locationId = req.params.id;

    // Check if the location with the specified ID exists
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({ message: "location not found" });
    }
    await Location.findByIdAndRemove(locationId);

    res.status(200).json({ message: "location deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateLocation = async (req, res) => {
  const locationId = req.params.id;
  const updatedLocationData = req.body;

  try {
    // Find the location by ID
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Update location properties
    if (updatedLocationData.name) {
      location.name = updatedLocationData.name;
    }
    if (updatedLocationData.color) {
      location.color = updatedLocationData.color;
    }
    if (updatedLocationData.offerCount) {
      location.offerCount = updatedLocationData.offerCount;
    }

    // Save the updated location to the database
    const updatedLocation = await location.save();

    res.status(200).json({
      message: "Location updated successfully",
      location: updatedLocation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update location" });
  }
};
