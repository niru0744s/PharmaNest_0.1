const express = require("express");
const router = express.Router();

router.get("/products");
router.post("/addProduct");
router.update("/updateProduct");
router.delete("/delproduct");

module.exports = router;