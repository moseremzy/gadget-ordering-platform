const express = require("express")
const cronroutes = express.Router();
const API = require("../api/api")



//CRON JOBS

cronroutes.post('/cron_payment_verification', API.cron_payment_verification);



module.exports = cronroutes