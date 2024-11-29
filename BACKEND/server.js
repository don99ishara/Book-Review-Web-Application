const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 8070;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection URI
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// MongoDB Connection
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection success!");
});





//bookRoutes
const BookRouter = require("./routes/BookRoutes")
//reviewRoutes
const BookReviewRouter = require("./routes/ReviewRoutes");

app.use("/books",BookRouter);
app.use("/reviews",BookReviewRouter);



app.listen(PORT, () => {
    console.log(`Server is up and running on PORT ${PORT}`);
});
