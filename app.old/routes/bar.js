var express = require('express');
var router = express.Router();
const { QueryTypes } = require('sequelize');

const bar = require('../models/bar');
const user = require('../models/user');
const sequelize = require('../utils/database');
const event = require('../models/event');
const { checkToken } = require('../utils/tokens');

/**
 * @swagger
 *
 *  components:
 *      schema:
 *          bar:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  address:
 *                      type: string
 *                  postcode:
 *                      type: integer
 *                  city:
 *                      type: string
 *                  mail:
 *                      type: string
 *          bar_event:
 *              type: object
 *              properties:
 *                  id_event:
 *                      type: integer
 */

router.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 3) {
                let bars = await bar.findAll();
                res.status(200).json(bars);
            }
        }
    }
});

/**
 * @swagger
 * /bar/{barId}:
 *  get:
 *      tags:
 *          - Bar
 *      description: Retourne les informations d'un bar en fonction de son id
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *      responses:
 *          200:
 *              description: Retourne les informations d'un bar
 *          404:
 *              description: L'id bar saisie n'est pas connu ne base de données
 */
router.get('/find-one/:barId', async (req, res) => {
    let { barId } = req.params;
    let aBar = await bar.findByPk(barId);
    res.status(200).json(aBar);
});

/**
 * @swagger
 * /bar/create:
 *  post:
 *      tags:
 *          - Bar
 *      description: Créer un bar
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/bar'
 *      responses:
 *          201:
 *              description: Créer un nouveau bar
 *          404:
 *              description: Erreurs provenant des paramètres
 *          409:
 *              description: Le bar existe déjà en base de données
 */
router.post('/create', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 1) {
                if (!req.body.name) {
                    res.json('Error: name is required')
                }
                if (!req.body.address) {
                    res.json('Error: address is required')
                }
                if (!req.body.postcode) {
                    res.json('Error: postcode is required')
                }
                if (!req.body.city) {
                    res.json('Error: city is required')
                }
                if (!req.body.mail) {
                    res.json('Error: mail is required')
                }
                if (!req.body.description) {
                    res.json('Error: description is required')
                }
                let barBDD = await bar.findOne({
                    where: {
                        name: req.body.name,
                        address: req.body.address,
                        postcode: req.body.postcode,
                        city: req.body.city,
                        mail: req.body.mail
                    }
                })
                if (barBDD) {
                    res.status(200).json('Bar already created');
                    console.log('Bar is already created');
                } else {
                    const newBar = bar.build({
                        name: req.body.name,
                        address: req.body.address,
                        postcode: req.body.postcode,
                        city: req.body.city,
                        mail: req.body.mail,
                        description: req.body.description,
                        image: req.body.image,
                        id_user: tokenOk.id_user
                    });
                    await newBar.save();

                    const updateUser = await user.findByPk(tokenOk.id_user);
                    updateUser.role_id = 2;
                    updateUser.save();

                    res.json("Bar is created").status(201);
                }
            }
        }
    }
});

/**
 * @swagger
 * /bar/update/{barId}:
 *  put:
 *      tags:
 *          - Bar
 *      description: Modifie un bar
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/bar'
 *      responses:
 *          201:
 *              description: Modifie un bar
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.put('/update/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 2) {
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
                if (req.body.description) {
                    aBar.description = req.body.description;
                }
                if (req.body.image) {
                    aBar.image = req.body.image;
                }

                await aBar.save();

                res.json("Bar is updated").status(200);
            }
        }
    }
});

/**
 * @swagger
 * /bar/delete/{barId}:
 *  delete:
 *      tags:
 *          - Bar
 *      description: Modifie un bar
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *      responses:
 *          200:
 *              description: Supprime un bar
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.delete('/delete/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 3) {
                let { barId } = req.params;
                let aBar = await bar.findByPk(barId);

                if (!aBar) {
                    res.json('Error: This barId is unknow').status(404);
                    console.log('Error: This barId is unknow');
                } else {
                    await aBar.destroy();

                    res.json("Bar deleted").status(200);
                }
            }
        }
    }
});

// ROUTE API WITH JOIN FOR EVENTS

/**
 * @swagger
 * /bar/events/{barId}:
 *  get:
 *      tags:
 *          - Bar
 *      description: Récupère les évènements liés à un bar
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *      responses:
 *          200:
 *              description: Récupère les évènements liés à un bar
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.get('/events/:barId', async (req, res) => {
    let { barId } = req.params;

    let aBar = await bar.findByPk(barId);
    if (!aBar) {
        res.json("Error: This barId is unknow in database").status(404);
        console.log("Error: This barId is unknow in database");
    } else {
        const events_from_bar = await sequelize.query(
            "SELECT EVENT.id as eventId, EVENT.name as eventName, EVENT.description as eventDescription, EVENT.date_event as eventDate, SPORT.name as sportName FROM EVENT LEFT JOIN BAR_EVENT ON EVENT.id = BAR_EVENT.id_event LEFT JOIN BAR ON BAR_EVENT.id_bar = BAR.id LEFT JOIN SPORT ON SPORT.id = EVENT.id_sport WHERE BAR.id = :id_bar",
            {
                replacements: { id_bar: barId },
                type: QueryTypes.SELECT
            }
        );
        res.status(200).json(events_from_bar);
    }
});

/**
 * @swagger
 * /bar/events/{barId}:
 *  post:
 *      tags:
 *          - Bar
 *      description: Ajoute un évènement à un bar
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/bar_event'
 *      responses:
 *          201:
 *              description: Ajoute un évènement à un bar
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.post('/events/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 2) {
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
            }
        }
    }
});

/**
 * @swagger
 * /bar/events/{barId}:
 *  delete:
 *      tags:
 *          - Bar
 *      description: Supprime un évènement à un bar
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/bar_event'
 *      responses:
 *          200:
 *              description: Supprime un évènement à un bar
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.delete('/events/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 2) {
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
            }
        }
    }
});

router.get('/top-bars', async (req, res) => {
    let bars = await bar.findAll({limit: 8, order: [['id', 'DESC']]});
    if(!bars) {
        res.status(200).json("We don't have any bars in database");
    }
    res.status(200).json(bars);
});

router.get('/details/:barId', async (req, res) => {
    let { barId } = req.params;

    let aBar = await bar.findByPk(barId);
    if (!aBar) {
        res.json("Error: This barId is unknow in database").status(404);
        console.log("Error: This barId is unknow in database");
    } else {
        const events_from_bar = await sequelize.query(
            "SELECT EVENT.id as eventId, EVENT.name as eventName, EVENT.description as eventDescription, EVENT.date_event as eventDate, SPORT.name as sportName FROM EVENT LEFT JOIN BAR_EVENT ON EVENT.id = BAR_EVENT.id_event LEFT JOIN BAR ON BAR_EVENT.id_bar = BAR.id LEFT JOIN SPORT ON SPORT.id = EVENT.id_sport WHERE BAR.id = :id_bar",
            {
                replacements: { id_bar: barId },
                type: QueryTypes.SELECT
            }
        );
        res.status(200).json({"bar": aBar, "events": events_from_bar});
    }
});


module.exports = router;
