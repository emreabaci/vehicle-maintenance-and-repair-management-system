const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Maintenance = require('../models/maintenance');

// Statistics
router.get('/', async (req, res, next) => {
    const totalUser = await User.getUsersTotalCount();
    const totalMaintenances = await Maintenance.getMaintenancesByAggrate();
    const totalRepairs = await Maintenance.getRepairsByAggrate();

    res.json({success: true, totalUser, totalMaintenances, totalRepairs});
});

module.exports = router;