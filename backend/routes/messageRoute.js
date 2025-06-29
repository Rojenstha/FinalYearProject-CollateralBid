const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isAdmin, protect }= require("../middleWare/authMiddleWare")

router.post("/", messageController.sendMessage);
router.get("/messages", messageController.allMessage);

module.exports = router;
