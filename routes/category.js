const { categoryCreate, categoryList, uploadImages } = require("../controller/category/category")
const express = require("express");
const xAccessToken = require("../middlewares/xAccessToken");

router = express.Router();


router.post('/category/create', categoryCreate);
router.get('/category/list', categoryList);

module.exports = router;