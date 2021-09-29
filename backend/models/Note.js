const mongoose = require("mongoose");
const { Schema } = mongoose; // Importing Schema by destructuring from mongoose

// Creating a new Schema of Notes
const NotesSchema = new Schema({
  user: {
    // Associating note with the user
    type: mongoose.Schema.Types.ObjectId, // Keeping the ObjectID from another model that is user
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("notes", NotesSchema);
