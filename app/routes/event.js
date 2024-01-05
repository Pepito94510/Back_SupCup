var express = require('express');
var router = express.Router();

const event = require('../models/event');
const sport = require('../models/sport');
const { checkToken } = require('../utils/tokens');

const Sequelize = require('sequelize');
const op = Sequelize.Op;

/**
 * @swagger
 * 
 *  components:
 *      schema:
 *          event:
 *              type: object
 *              properties: 
 *                  id_sport:
 *                      type: integer
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 */

router.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 3) {
                let events = await event.findAll();
                if (!events) {
                    res.status(200).json("We don't have any event in database");
                }
                res.status(200).json(events);
            }
        }
    }
});

/**
 * @swagger
 * /event/{eventId}:
 *  get:
 *      tags: 
 *          - Event
 *      description: Retourne les informations d'un évènement en fonction de son id
 *      parameters: 
 *          - in: path
 *            name: eventId
 *            description: id de l'évènement
 *      responses: 
 *          200:
 *              description: Retourne les informations d'un évènement
 *          404:
 *              description: L'id évènement saisie n'est pas connu ne base de données
 */
router.get('/find-one/:eventId', async (req, res) => {
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
                let { eventId } = req.params;
                let aEvent = await event.findByPk(eventId);
                if (!aEvent) {
                    res.status(404).json('Error: This id_event is unknow in database');
                } else {
                    res.status(200).json(aEvent);
                }
            }
        }
    }
});

/**
 * @swagger
 * /event/create:
 *  post:
 *      tags: 
 *          - Event
 *      description: Créer un évènement
 *      parameters: 
 *          - in: path
 *            name: eventId
 *            description: id de l'évènement
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/event'
 *      responses: 
 *          201:
 *              description: Créer un nouveau évènement
 *          404:
 *              description: Erreurs provenant des paramètres
 *          409:
 *              description: L'évènement existe déjà en base de données
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
            if (tokenOk.role_id >= 2) {
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
                            description: req.body.description,
                            date_event: req.body.date
                        });
                        await newEvent.save();

                        res.json("Event created").status(201);
                        console.log('Event: ' + event_name_requested + ' created in database');
                    }
                }
            }
        }
    }
});

/**
 * @swagger
 * /event/update:
 *  put:
 *      tags: 
 *          - Event
 *      description: Modifie un évènement
 *      parameters: 
 *          - in: path
 *            name: eventId
 *            description: id de l'évènement
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/event'
 *      responses: 
 *          201:
 *              description: Modifie un nouveau évènement
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.put('/update/:eventId', async (req, res) => {
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
                let { eventId } = req.params;
                let aEvent = await event.findByPk(eventId);
                let errorMessage = "";

                //check parameters and body
                if (!req.body.id_sport && !req.body.name && !req.body.description && !req.body.date) {
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
                    if (req.body.date) {
                        aEvent.date_event = req.body.date;
                    }
                    await aEvent.save();
                    res.json("Event updated" + errorMessage).status(200);
                }
            }
        }
    }
});

/**
 * @swagger
 * /event/update:
 *  delete:
 *      tags: 
 *          - Event
 *      description: Supprime un évènement
 *      parameters: 
 *          - in: path
 *            name: eventId
 *            description: id de l'évènement
 *      responses: 
 *          201:
 *              description: Supprime un nouveau évènement
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.delete('/delete/:eventId', async (req, res) => {
    if(!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if(!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if(tokenOk.role_id >= 2) {
                let { eventId } = req.params;
                let aEvent = await event.findByPk(eventId);
            
                if (!aEvent) {
                    res.json('Error: This eventId is unknow').status(404);
                    console.log('Error: This eventId is unknow');
                } else {
                    await aEvent.destroy();
                    res.json("Event deleted").status(200);
                }
            }
        }
    }
});

router.get('/next-events', async (req, res) => {
    let events = await event.findAll({where: {date_event: {[op.gte]: new Date().toISOString().split('T')[0]}}, limit: 8, order: [['date_event', 'ASC']]});
    if(!events) {
        res.status(200).json("We don't have any event in database");
    }
    res.status(200).json(events);
});

module.exports = router;
