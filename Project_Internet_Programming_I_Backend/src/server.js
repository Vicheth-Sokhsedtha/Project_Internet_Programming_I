const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Women Clothes Backend is running");
});

// routes
app.use("/api/products", require("./routes/product.routes"));

sequelize.authenticate()
  .then(() => {
    console.log("MySQL connected");
    app.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch(err => console.log(err));

const Product = require("./models/Product");

sequelize.sync()
  .then(() => console.log("Tables created"));
