const express = require("express");
const User = require("../models/User"); // User Schema
const router = express.Router(); // Express Router for creating endpoints
const { body, validationResult } = require("express-validator"); // Express-Validator for validation
const bcrypt = require("bcryptjs"); // BcryptJS for hashing the passwords
const jwt = require("jsonwebtoken"); // JSON Web Token (JWT) for authenticating the user using
const fetchuser = require("../middleware/fetchUser"); // Middleware for fetching user details

const JWT_SECRET = "Adityaisaprogramm3r"; // Secret for JWT authentication

// ROUTE 1: Create a user using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser", // Endpoint
  [
    // Validation
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are error, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });

      // If the user exists already then send (400) "Bad Request"
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with this email already exists" });
      }

      // JWT Salt for the enhacement of security
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt); // Hashing (password + salt)

      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      // Setting the user data
      const data = {
        user: {
          id: user.id,
        },
      };

      // JWT User Authentication Token with (User data + JWT_SECRET)
      const authToken = jwt.sign(data, JWT_SECRET);

      // Sending JSON of the user's authentication token in response
      res.json({ authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post(
  "/login", // Endpint
  [
    // Validation
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If there are error, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body; // Extracting email and password from req.body using "destructuring"
    try {
      // Finding user on the basis of his email
      let user = await User.findOne({ email });

      // If user is not there, return (400) "Bad request"
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      // Matching the hashes of passwords (Password in MongoDB and Password entered by the user)
      const passwordCompare = await bcrypt.compare(password, user.password);

      // If passwords do not match, return (400) "Bad request"
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      // Setting the user data
      const data = {
        user: {
          id: user.id,
        },
      };

      // JWT User Authentication Token with (User data + JWT_SECRET)
      const authToken = jwt.sign(data, JWT_SECRET);

      // Sending JSON of the the JWT User Authentication Token in response
      res.json({ authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    // Setting userId to user id provided in request
    let userId = req.user.id;

    // Getting all the details of user except password "-password"
    const user = await User.findById(userId).select("-password");

    // Sending JSON of the user details in reponse
    res.send(user);
  } catch (err) {
    // Catching error and sending (500) "Internal Server Error" in response
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
