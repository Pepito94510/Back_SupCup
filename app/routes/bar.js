var express = require('express');
var router = express.Router();
const { QueryTypes } = require('sequelize');

const bar = require('../models/bar');

const sequelize = require('../utils/database');
const event = require('../models/event');

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
        name: req.body.name,
        address: req.body.address,
        postcode: req.body.postcode,
        city: req.body.city,
        mail: req.body.mail,
    });

    await newBar.save();

    res.send("Bar_created");
});

router.post('/update/:barId', async(req, res) => {
    let { barId } = req.params;
    let aBar = await bar.findByPk(barId);

    if (req.body.name) {
        aBar.name = req.body.name;
    }
    if (req.body.address) {
        aBar.address = req.body.address;
    }
    if (req.body.postcode) {
        aBar.postcode = req.body.postcode;
    }
    if (req.body.city) {
        aBar.city = req.body.city;
    }
    if (req.body.mail) {
        aBar.mail = req.body.mail;
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

// ROUTE API WITH JOIN FOR EVENTS

router.get('/events/:barId', async (req, res) => {
    let { barId } = req.params;

    let aBar = await bar.findByPk(barId);
    if (!aBar) {
        res.json("Error: This barId is unknow in database").status(404);
        console.log("Error: This barId is unknow in database");
    } else {
        const events_from_bar = await sequelize.query(
            "SELECT EVENT.id, EVENT.name, EVENT.description FROM EVENT LEFT JOIN BAR_EVENT ON EVENT.id = BAR_EVENT.id_event LEFT JOIN BAR ON BAR_EVENT.id_bar = BAR.id WHERE BAR.id = :id_bar",
            {
                replacements: { id_bar: barId },
                type: QueryTypes.SELECT
            }
        );
        res.status(200).json(events_from_bar);
    }
});

router.post('/events/:barId', async (req, res) => {
    let { barId } = req.params;

    let aBar = await bar.findByPk(barId);
    if (!aBar) {
        res.json("Error: This barId is unknow in database").status(404);
        console.log("Error: This barId is unknow in database");
    } else {
        let eventId = req.body.id_event;
        let check_eventId = await event.findByPk(eventId);
        if (!check_eventId) {
            res.json("Error: This eventId is unknow in database").status(404);
            console.log("Error: This eventId is unknow in database");
        } else {
            const [result, metadata] = await sequelize.query(
                "SELECT id FROM `BAR_EVENT` WHERE `id_bar` = :id_bar AND `id_event` = :id_event",
                {
                    replacements: { id_bar: barId, id_event: eventId },
                    type: QueryTypes.SELECT
                }
            );
            if (result) {
                res.json("Error: This relation is already in database").status(404);
                console.log("Error: This relation is already in database");
            } else {
                const bar_participe_event = await sequelize.query(
                    "INSERT INTO `BAR_EVENT`(`id`, `id_bar`, `id_event`) VALUES (null, :id_bar, :id_event)",
                    {
                        replacements: { id_bar: barId, id_event: eventId },
                        type: QueryTypes.INSERT
                    }
                );
                res.json("Relation created").status(201);
                console.log("Un bar participe à un event");
            }
        }
    }
});

router.delete('/events/:barId', async (req, res) => {
    let { barId } = req.params;

    let aBar = await bar.findByPk(barId);
    if (!aBar) {
        res.json("Error: This barId is unknow in database").status(404);
        console.log("Error: This barId is unknow in database");
    } else {
        let eventId = req.body.id_event;
        let check_eventId = await event.findByPk(eventId);
        if (!check_eventId) {
            res.json("Error: This eventId is unknow in database").status(404);
            console.log("Error: This eventId is unknow in database");
        } else {
            const [result, metadata] = await sequelize.query(
                "SELECT id FROM `BAR_EVENT` WHERE `id_bar` = :id_bar AND `id_event` = :id_event",
                {
                    replacements: { id_bar: barId, id_event: eventId },
                    type: QueryTypes.SELECT
                }
            );
            if (!result) {
                res.json("Error: This relation is unknow in database").status(404);
                console.log("Error: This relation is unknow in database");
            } else {
                const delete_participation = await sequelize.query(
                    "DELETE FROM `BAR_EVENT` WHERE `id` = :id",
                    {
                        replacements: { id: result["id"] },
                        type: QueryTypes.DELETE
                    }
                );
                res.json("Relation deleted").status(200);
                console.log("Suppression d'une participation d'un bar");
            }
        }
    }
});

module.exports = router;
