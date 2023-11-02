import Location from "../models/Location.js";

export const addLocation = async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    const savedLocation = await newLocation.save();
    res.json(savedLocation);
  } catch (error) {
    res.status(500).json({ error: "Failed to add a location" });
  }
};

export const getAllLocations = async (req, res) => {
  try {
    const allLocations = await Location.find().exec();
    console.log(allLocations);
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
