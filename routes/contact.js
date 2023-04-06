const { contactCreate } = require("../controller/contact/contacts")
const { Router } = require("express");
const express = require("express");
const xAccessToken = require("../middlewares/xAccessToken");

router = express.Router();


router.post('/contact/create', contactCreate);

module.exports = router;