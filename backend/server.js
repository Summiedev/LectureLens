const express  = require("express");
const http     = require("http");
const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const cors     = require("cors");


dotenv.config();
require("./config/db")();


const app    = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(passport.initialize());

// Routes
app.use("/api", require("./routes"));



// Start listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);