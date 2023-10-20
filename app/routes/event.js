var express = require('express');
var router = express.Router();

const event = require('../models/event');
const sport = require('../models/sport');

router.get('/', async (req, res) => {
    let events = await event.findAll();
    if(!events) {
        res.status(200).json("We don't have any event in database");
    }
    res.status(200).json(events);
});

router.get('/:eventId', async (req, res) => {
    let { eventId } = req.params;
    let aEvent = await event.findByPk(eventId);
    if(!aEvent) {
        res.status(404).json('Error: This id_event is unknow in database');
    } else {
        res.status(200).json(aEvent);
    }
});

router.post('/create', async (req, res) => {
    if (!req.body.id_sport || !req.body.name) {
        res.json('Error: check your parameters. id_sport and name are required').status(404);
        console.log('Error: id_sport or name are missing in parameters');
    } else {
        let sport_requested = req.body.id_sport;
        let event_name_requested = req.body.name.toString().toLowerCase();

        //check if id_sport is already in database
        let sportBDD = await sport.findByPk(sport_requested);

        if (!sportBDD) {
            res.json('Error: this sport is not in database');
            console.log('Sport unknow');
        } else {
            const newEvent = event.build({
                id_sport: sport_requested,
                name: event_name_requested,
                description: req.body.description
            });
            await newEvent.save();

            res.json("Event created").status(201);
            console.log('Event: ' + event_name_requested + ' created in database');
        }
    }
});

router.put('/update/:eventId', async (req, res) => {
    let { eventId } = req.params;
    let aEvent = await event.findByPk(eventId);
    let errorMessage = "";

    //check parameters and body
    if (!req.body.id_sport && !req.body.name && !req.body.description) {
        res.json('Error: check your parameters. Either id_sport or name or description is required').status(404);
        console.log('Error: id_sport or name or logo are missing in parameters');
    } else if (!aEvent) {
        res.json('Error: check your eventId. Either id_sport or name or description is required').status(404);
        console.log('Error: id_sport or name or logo are missing in parameters');
    } else {
        let id_sport_requested = aEvent.id_sport;
        if (req.body.id_sport) {
            id_sport_requested = req.body.id_sport;

            let sportId_BDD = await sport.findByPk(id_sport_requested);

            if (sportId_BDD) {
                aEvent.id_sport = req.body.id_sport;
            } else {
                console.log('Error: This id_sport is unknow');
                errorMessage = " Warning: this id_sport is unknow in database. The id_sport wasn't updated";
            }
        }
        if (req.body.name) {
            aEvent.name = req.body.name;
        }
        if (req.body.description) {
            aEvent.description = req.body.description;
        }
        await aEvent.save();
        res.json("Event updated" + errorMessage).status(200);
    }
});

router.delete('/delete/:eventId', async (req, res) => {
    let { eventId } = req.params;
    let aEvent = await event.findByPk(eventId);

    if(!aEvent) {
        res.json('Error: This eventId is unknow').status(404);
        console.log('Error: This eventId is unknow');
    } else {
        await aEvent.destroy();
        res.json("Event deleted").status(200);
    }
});

module.exports = router;