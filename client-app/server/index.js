require("dotenv").config();

const express = require("express");
const port = process.env.PORT || 9000;
const router = require("./routes/router.js");
const cronroutes = require("./routes/cronroutes.js");
const cron = require('./middlewares/cron.js');
const cors = require("cors");
const path = require("path");
const app = express();


app.use(cors({
  origin: "http://localhost:8080",   // your Vue frontend
  credentials: true,                 // 🔥 THIS IS REQUIRED FOR COOKIES
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use(router);
app.use("/", cronroutes);

// ✅ Static files
app.use('/images', express.static(path.join(__dirname, "../../product-images")));

// Production static serving (if needed)
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(__dirname + "/dist/"));
//     app.get("*", (req, res) => {
//         res.sendFile(__dirname + "/dist/index.html");
//     });
// }

app.listen(port, () => {
  console.log("server started on port", port);
});
