const { contactCreate, contactList } = require("../controller/contact/contacts")
const express = require("express");
const xAccessToken = require("../middlewares/xAccessToken");

router = express.Router();


router.post('/contact/create', contactCreate);
router.get('/contact/list', contactList);
module.exports = router;