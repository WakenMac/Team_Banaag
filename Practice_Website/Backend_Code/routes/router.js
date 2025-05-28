const express = require('express');
const router = express.Router();
const dbhandler = require('../controllers/mainHandler.js');

// Define authentication routes

router.get('/admins/all', dbhandler.getAllAdmins);

module.exports = router; // Exports the router to become usable by server.js