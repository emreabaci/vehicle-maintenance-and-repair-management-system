const express = require('express');
const router = express.Router();
const Maintenance = require('../models/maintenance');
const Record = require('../models/record');
const passport = require('passport');

//Add maintenance
router.post('/', passport.authenticate('jwt', {session:false}), async(req, res, next) => {
    const records = req.body.maintenance.records;
    const newMaintenance = new Maintenance ({
        type: req.body.maintenance.type,
        createdBy: req.body.userID,
        plateNumber: req.body.maintenance.plateNumber
      });

    for(var i = 0; i < records.length; i++){
        const _rec = new Record({
            description: records[i].description,
            owner: newMaintenance._id
        });

        await _rec.save();
        newMaintenance.records.push(_rec);       
    }

    await newMaintenance.save();
    res.json({success: true, msg: 'Maintenance created'});
});

//Update maintenance
router.put('/', passport.authenticate('jwt', {session:false}), async(req, res, next) => {
    const _id = req.body.updatedMaintenance.id;
    const _type = req.body.updatedMaintenance.type;
    const _plateNumber = req.body.updatedMaintenance.plateNumber;

    for(let record of req.body.updatedMaintenance.records){
        if(record?.isUpdated){
            await Record.updateRecord({ _id: record.id }, { $set: {description: record.description}});
        }
    }

    const query = { _id };
    const newvalues = { $set: {type: _type, plateNumber: _plateNumber}};

    const _res = await Maintenance.updateMaintenance(query, newvalues);

    res.json({success: true, msg: 'Maintenance updated', res: _res});
});

//Get maintenances
router.get('/', async(req, res, next) => {
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