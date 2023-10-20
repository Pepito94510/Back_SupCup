var express = require('express');
var router = express.Router();

const bar = require('../models/bar');

router.get('/', async(req, res) => {
    let bars = await bar.findAll();
    res.status(200).json(bars);
});

router.get('/:barId', async(req, res) => {
    let { barId } = req.params;
    let aBar = await bar.findByPk(barId);
    res.status(200).json(aBar);
});

router.post('/create', async(req, res) => {
    console.log(req.body);

    const newBar = bar.build({
        Name: req.body.name,
        Address: req.body.address,
        Postcode: req.body.postcode,
        City: req.body.city,
        Email: req.body.email,
    });

    await newBar.save();

    res.send("Bar_created");
});

router.post('/update/:barId', async(req, res) => {
    let { barId } = req.params;
    let aBar = await bar.findByPk(barId);

    if (req.body.name) {
        aBar.Name = req.body.name;
    }
    if (req.body.address) {
        aBar.Address = req.body.address;
    }
    if (req.body.postcode) {
        aBar.Postcode = req.body.postcode;
    }
    if (req.body.city) {
        aBar.City = req.body.city;
    }
    if (req.body.email) {
        aBar.Email = req.body.email;
    }

    await aBar.save();

    res.send("Bar_updated");
});

router.post('/delete/:barId', async(req, res) => {
    let { barId } = req.params;
    let aBar = await bar.findByPk(barId);

    await aBar.destroy();

    res.send("Bar_deleted");
});

module.exports = router;
