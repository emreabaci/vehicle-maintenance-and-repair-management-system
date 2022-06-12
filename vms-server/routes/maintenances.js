const express = require('express');
const router = express.Router();
const Maintenance = require('../models/maintenance');
const passport = require('passport');

//Add maintenance
router.post('/', passport.authenticate('jwt', {session:false}), async(req, res, next) => {
    const maintenances = req.body.maintenances;
    let newMaintenance = null;

    for(var i = 0; i < maintenances.length; i++){
        newMaintenance = new Maintenance ({
            type: req.body.type,
            description: maintenances[i].description,
            createdBy: req.body.userId,
            plateNumber: req.body.plateNumber
          });

         await Maintenance.addMaintenance(newMaintenance);
    }

    res.json({success: true, msg: 'Maintenance created'});
});

//Update maintenance
router.put('/', passport.authenticate('jwt', {session:false}), async(req, res, next) => {
    const _id = req.body.id;
    const _type = req.body.type;
    const _plateNumber = req.body.plateNumber;
    const _description = req.body.description;

    const query = { _id };
    const newvalues = { $set: {type: _type, plateNumber: _plateNumber,  description: _description}};

    const _res = await Maintenance.updateMaintenance(query, newvalues);

    res.json({success: true, msg: 'Maintenance updated', res: _res});
});

//Get maintenances
router.get('/', passport.authenticate('jwt', {session:false}), async(req, res, next) => {
    const pageNo = parseInt(req.query.pageNo);
    const size = parseInt(req.query.size);
    const plateNumber = req.query.plateNumber || null;
    const type = req.query.type;

    if(pageNo < 0 || pageNo === 0) {
        return res.json({success: false, msg: "invalid page number, should start with 1"})
    }

    var query = {};
    query.skip = size * (pageNo - 1);
    query.limit = size;

    let totalCount;
    let maintenances;

    if(plateNumber){
        totalCount = await Maintenance.getMaintenancesTotalCountByPlateNumber(plateNumber, type);
        maintenances = await Maintenance.getMaintenancesByPlateNumber(query, plateNumber, type);
    } else {
        totalCount = await Maintenance.getMaintenancesTotalCount(type);
        maintenances = await Maintenance.getMaintenances(query, type);
    }

    //var totalPages = Math.ceil(totalCount / size)

    res.json({success: true, maintenances: maintenances, count: totalCount});
});

// Delete maintenance
router.delete('/:id', passport.authenticate('jwt', {session:false}), async(req, res, next) => {
    await Maintenance.deleteMaintenance(req.params.id);
    res.json({success: true});
});

module.exports = router;