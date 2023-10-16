var express = require('express');
var router = express.Router();

const sport = require('../models/sport');

router.get('/', async(req, res) => {
    let sports = await sport.findAll();
    res.status(200).json(sports);
});

router.get('/:sportId', async(req, res) => {
    let { sportId } = req.params;
    let aSport = await sport.findByPk(sportId);
    res.status(200).json(aSport);
});

router.post('/create', async(req, res) => {
    console.log(req.body);

    const newSport = sport.build({
        Name: req.body.name,
    });

    await newSport.save();

    res.send("Sport_created");
});

router.post('/update/:sportId', async(req, res) => {
    let { sportId } = req.params;
    let aSport = await sport.findByPk(sportId);

    if (req.body.name) {
        aSport.Name = req.body.name;
    }

    await aSport.save();

    res.send("Sport_updated");
});

router.post('/delete/:sportId', async(req, res) => {
    let { sportId } = req.params;
    let aSport = await sport.findByPk(sportId);

    await aSport.destroy();

    res.send("Sport_deleted");
});

module.exports = router;
