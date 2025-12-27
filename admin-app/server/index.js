require("dotenv").config();

const express = require("express");
const port = process.env.PORT || 7000;
const router = require("./routes/router.js")
const cors = require("cors");
const app = express();
const path = require("path")

app.use(cors({
  origin: "http://localhost:8081",   // your Vue frontend
  credentials: true,                 // 🔥 THIS IS REQUIRED FOR COOKIES
}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);
app.use('/images', express.static(path.join(__dirname, "../../product-images")));


// app.use(express.static(path.join(__dirname, "/dist")));



 
 
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(__dirname+"/dist/"))
//     app.get("*", (req, res) => {
//         res.sendFile(__dirname+"/dist/index.html")
//     })
// }



app.listen(port, () => {

  console.log("server started...")

})
