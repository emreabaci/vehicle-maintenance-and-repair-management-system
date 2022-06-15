const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Maintenance = require('../models/maintenance');

// Register
router.get('/', async (req, res, next) => {
    const totalUser = await User.getUsersTotalCount();
    const maintenances = await Maintenance.getMaintenancesByAggrate();
    const repairs = await Maintenance.getRepaitsByAggrate();
    
    const totalMaintenances = maintenances.length;
    const totalRepairs = repairs.length;

    res.json({success: true, totalUser, totalMaintenances, totalRepairs});
});

module.exports = router;