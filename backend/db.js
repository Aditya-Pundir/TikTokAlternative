const mongoose = require("mongoose");

// Connecting MongoDB to the server:
const mongoURI =
  "mongodb://localhost:27017/iNoteBook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
// mongodb+srv://coder420:coder420@inotebook.nhgud.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const connectToMongo = () => {
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: false, // To avoid the duplication
    })
    .then((con) => {
      console.log("Connected to MongoDB successfully");
    });
};

module.exports = connectToMongo;
