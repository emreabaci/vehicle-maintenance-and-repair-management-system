const express = require('express');
const router = express.Router();
const Maintenance = require('../models/maintenance');

//Add maintenance
router.post('/', async(req, res, next) => {
    const maintenances = req.body.maintenances;
    let newMaintenance = null;

    for(var i = 0; i < maintenances.length; i++){
        newMaintenance = new Maintenance ({
            description: maintenances[i].description,
            creatorUserId: req.body.userId,
            plateNumber: req.body.plateNumber
          });

         await Maintenance.addMaintenance(newMaintenance);
    }

    res.json({success: true, msg: 'Maintenance created'});
});

//Get maintenances
router.get('/', async(req, res, next) => {
    const maintenances = await Maintenance.getMaintenances();
    res.json({success: true, maintenances: maintenances});
})

module.exports = router;