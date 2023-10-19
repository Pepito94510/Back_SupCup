var express = require('express');
var router = express.Router();

const equipe = require('../models/equipe');
const sport = require('../models/sport');

router.get('/', async(req, res) => {
    let equipes = await equipe.findAll();
    res.status(200).json(equipes);
});

router.get('/:equipeId', async(req, res) => {
    let { equipeId } = req.params;
    let aEquipe = await equipe.findByPk(equipeId);
    res.status(200).json(aEquipe);
});

router.post('/create', async(req, res) => {

    if (!req.body.name || !req.body.id_sport) {
        res.json('Error: check your parameters. id_sport and name are required').status(404);
        console.log('Error: id_sport or name are missing in parameters');
    } else {
        let sport_requested = req.body.id_sport;
        let equipe_name_requested = req.body.name.toString().toLowerCase();

        // check if equipe is not already in database
        let equipeBDD = await equipe.findOne({ where: { name: equipe_name_requested, id_sport: sport_requested} });

        //check if id_sport exist in database
        let sportBDD = await sport.findByPk(sport_requested);

        if(!sportBDD) {
            res.json('Error: this sport is not in database');
            console.log('Sport unknow');
        } else if (equipeBDD) {
            res.status(200).json('Equipe already created');
            console.log('Equipe already created');
        } else {
            const newEquipe = equipe.build({
                id_sport: sport_requested,
                name: equipe_name_requested,
                logo: req.body.logo
            });
            await newEquipe.save();
    
            res.json("Equipe created").status(201);
            console.log('Equipe: ' + equipe_name_requested + ' created in database');
        }
    }
});

router.put('/update/:equipeId', async(req, res) => {

    let { equipeId } = req.params;
    let aEquipe = await equipe.findByPk(equipeId);

    // check parameters and body
    if (!req.body.name && !req.body.id_sport && !req.body.logo) {
        res.json('Error: check your parameters. Either id_sport or name or logo is required').status(404);
        console.log('Error: id_sport or name or logo are missing in parameters');
    } else {

        let id_sport_requested = aEquipe.id_sport;
        if (req.body.id_sport) {
            id_sport_requested = req.body.id_sport;
        }

        // check if equipe name is not already in database
        let equipe_name_requested = req.body.name.toString().toLowerCase();

        let equipeBDD = await equipe.findOne({ where: { name: equipe_name_requested, id_sport: id_sport_requested } });
        let sportId_BDD = await sport.findByPk(id_sport_requested);

        if (req.body.name) {
            if (!equipeBDD) {
                aEquipe.name = req.body.name;
            } else {
                console.log('Error: This equipe name is already in database');
            }
        }
        if (req.body.id_sport) {
            if (sportId_BDD) {
                aEquipe.id_sport = req.body.id_sport;
            } else {
                console.log('Error: This id_sport is unknow');
            }
        }
        if (req.body.logo) {
            aEquipe.logo = req.body.logo;
        }

        await aEquipe.save();
        res.json("Equipe updated").status(200);
    }
});

router.delete('/delete/:equipeId', async(req, res) => {
    let { equipeId } = req.params;
    let aEquipe = await equipe.findByPk(equipeId);

    if (!aEquipe) {
        res.json('Error: This equipeId is unknow').status(404);
        console.log('Error: This equipeId is unknow');
    } else {
        await aEquipe.destroy();

        res.json("Equipe deleted").status(200);
    }
});

module.exports = router;
