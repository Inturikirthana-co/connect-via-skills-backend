const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/skills", require("./routes/skillRoutes"));

app.use("/api/credits", require("./routes/creditRoutes"));

app.use("/api/membership", require("./routes/membershipRoutes"));


// IMPORTANT CHANGE
app.use("/api/match", require("./routes/matchRequestRoutes"));

app.use("/api/profile", require("./routes/profileRoutes"));

app.use("/api/reviews", require("./routes/reviewRoutes"));

app.use("/api/messages", require("./routes/messageRoutes"));

app.use("/api/sessions", require("./routes/sessionRoutes"));

app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);

// Test Route
app.get("/", (req, res) => {

  res.send("🚀 Connect Via Skills Backend Running");

});


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`🚀 Server running on port ${PORT}`);

});