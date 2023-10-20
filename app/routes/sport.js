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

    if (!req.body.name) {
        res.json('Error: check your parameters. name is required').status(404);
        console.log('Error: name is missing in parameters');
    } else {
        // transform string on lowercase
        let new_sport = req.body.name.toString().toLowerCase();

        // check if sport is already in BDD
        let check_sport = await sport.findOne({ where: { name: new_sport } });

        if(check_sport) {
            res.status(200).json(req.body.name + ' already created');
            console.log(req.body.name + ' already created');
        } else {
            const newSport = sport.build({
                name: new_sport,
            });
            await newSport.save();

            res.json("Sport : " + req.body.name +  " created");
        }
    }
});

router.put('/update/:sportId', async(req, res) => {

    // check all params
    let { sportId } = req.params;

    // check if name is not empty
    if(!req.body.name) {
        res.json('Error: no value');
        console.log('Error: no value');
    } else {
        let sport_update = req.body.name.toString().toLowerCase();

        // check if value is ok with database
        let aSport = await sport.findByPk(sportId);
        let checkAllSports = await sport.findOne({ where: { name: sport_update } })

        if(!aSport) {
            console.log('sport not found');
            res.json("Error: sport not found").status(404);
        } else if (checkAllSports) {
            res.json(sport_update + ' is already in database').status(200);
            console.log(sport_update + ' is already in database');
        } else {
            aSport.name = sport_update;
            await aSport.save();
    
            res.json('sport updated').status(200);
        }
    }
});

router.delete('/delete/:sportId', async(req, res) => {
    let { sportId } = req.params;
    let aSport = await sport.findByPk(sportId);

    if (!aSport) {
        res.json('Error: This sportId is unknow').status(404);
        console.log('Error: This sportId is unknow');
    } else {
        await aSport.destroy();

        res.json("Sport deleted").status(200);
    }
});

module.exports = router;
