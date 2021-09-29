const express = require("express");
const router = express.Router(); // Express Router for creating endpoints
const fetchuser = require("../middleware/fetchUser"); // Importing Middleware for fetching user details
const Note = require("../models/Note"); // Schema for notes
const { body, validationResult } = require("express-validator"); // Express-Validator for validation of the notes

// ROUTE 1: Get all the notes using GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    // Finding notes using the user id
    const notes = await Note.find({ user: req.user.id });
    // Sending the json of notes in response
    res.json(notes);
  } catch (err) {
    // Catching error and sending "Internal Server Error" (500)
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new note using POST "/api/notes/addnote". Login required
router.post(
  "/addnote", // Endpoint
  fetchuser, // Middleware
  [
    // Validation
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "Description must be at least 5 characters long"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // If there are error, return Bad request and the errors array
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Making a new note from the "Note" schema
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      // Saving the note in MongoDB
      const savedNote = await note.save();

      // Returning JSON of the saved note
      res.json(savedNote);
    } catch (err) {
      // Catching error and sending "Internal Server Error" (500)
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing note using PUT "/api/notes/updatenote". Login required
router.put(
  "/updatenote/:id", // Endpoint
  fetchuser, // Middleware
  async (req, res) => {
    // Getting the data from req.body by destructuring
    const { title, description, tag } = req.body;

    try {
      // Create a newNote object
      const newNote = {};

      // If the data is present in req.body, the data in newNote will be equal to data in req.body
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      // Find the note to be updated and update it
      let note = await Note.findById(req.params.id);

      // Validation for security
      // Allow updation only if user owns this note else return (404) "Not Found" in response
      if (!note) {
        return res.status(404).send("Not Found");
      }

      // If id of user in note doesn't match the id in req, return (401) "Unauthorized"
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }

      // Find the note by id, updating and setting the value of note to it
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote }, // Updation value
        { new: true } // If a new contact comes, it will be created
      );
      res.json({ note });
    } catch (err) {
      // Catching error and sending "Internal Server Error" (500)
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 4: Delete a note using DELETE "/api/notes/delete". Login required
router.delete(
  "/deletenote/:id", // Endpoint
  fetchuser, // Middleware
  async (req, res) => {
    try {
      // Find the note to be deleted and delete it
      let note = await Note.findById(req.params.id);

      // Validation for security
      // Allow deletion only if user owns this note else return (404) "Not Found" in response
      if (!note) {
        return res.status(404).send("Not Found");
      }

      // If id of user in note doesn't match the id in req, return (401) "Unauthorized"
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }

      // Find the note by id, updating and setting the value of note to it
      note = await Note.findByIdAndDelete(req.params.id);
      res.json({ Success: "Note has been deleted", note: note });
    } catch (err) {
      // Catching error and sending "Internal Server Error" (500)
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
