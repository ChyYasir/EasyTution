import Subject from "../models/Subject.js";

export const addSubject = async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    const savedSubject = await newSubject.save();
    res.json(savedSubject);
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
