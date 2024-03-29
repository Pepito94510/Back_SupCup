import { Router } from "express";
const eventRouter = Router();
import * as eventService from '../services/eventService.js';
import { getSport } from "../services/sportService.js";
import { checkToken } from "../utils/tokens.js";

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

eventRouter.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let allEvents = await eventService.getEvents();
        res.json(allEvents).status(200);
    }
});

/**
 * @swagger
 * /event/find-one/{eventId}:
 *  get:
 *      tags:
 *          - Event
 *      description: Retourne les informations d'un évènement en fonction de son id
 *      parameters:
 *          - in: path
 *            name: eventId
 *            description: id de l'évènement
 *          - in: headers
 *            name: token
 *            description: token d'accès
 *      responses:
 *          200:
 *              description: Retourne les informations d'un évènement
 *          404:
 *              description: L'id évènement saisie n'est pas connu ne base de données
 */
eventRouter.get('/find-one/:eventId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: this token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let oneEvent = await eventService.getEvent(req.params.eventId);
        if (!oneEvent) {
            res.json('Error: no event found with this Id').status(404);
        } else {
            res.json(oneEvent).status(200);
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
 *          - in: headers
 *            name: token
 *            description: token d'accès
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
eventRouter.post('/create', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: this token is required').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
        } else {
            if (!req.body.sportId || !req.body.eventName ||
                !req.body.eventDescription || !req.body.eventDate) {
                res.json('Error: Missing parameters').status(404);
            } else {
                let checkSport = getSport(req.body.sportId);
                if (!checkSport) {
                    res.json('Error: This sport id is unknow in database');
                } else {
                    let newEvent = await eventService.createEvent(req.body.sportId, req.body.eventName, req.body.eventDescription, req.body.eventDate, req.body.eventImage);
                    if (!newEvent) {
                        res.json('Error: An error occured durint the save').status(500);
                    } else {
                        res.json(newEvent).status(201);
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
 *          - in: headers
 *            name: token
 *            description: token d'accès
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/event'
 *      responses:
 *          201:
 *              description: Modifie  l'évènement
 *          404:
 *              description: Erreurs provenant des paramètres
 */
eventRouter.put('/update/:eventId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: The token is incorect').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
        } else {
            //ajouter check TOKEN
            if (!req.params.eventId ||
                !req.body.sportId || !req.body.eventName ||
                !req.body.eventDescription || !req.body.eventDate) {
                res.json('Error: Missing parameters').status(404);
            } else {
                let checkEventObject = await eventService.getEvent(req.params.eventId);
                if (!checkEventObject) {
                    res.json('Error: this eventId is unknow in database').status(404);
                } else {
                    let checkSportId = await getSport(req.body.sportId);
                    if (!checkSportId) {
                        res.json('Error: This sportId is unknow in database').status(404);
                    } else {
                        await eventService.updateEvent(checkEventObject, req.body.sportId, req.body.eventName, req.body.eventDescription, req.body.eventDate, req.body.eventImage);
                        res.json('Event updated in database').status(200);
                    }
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
 *          - in: headers
 *            name: token
 *            description: token d'accès
 *      responses:
 *          201:
 *              description: Supprime un évènement
 *          404:
 *              description: Erreurs provenant des paramètres
 */
eventRouter.delete('/delete/:eventId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: The token is incorrect').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorrect').status(404);
        } else {
            //ajouter check TOKEN
            let checkEvent = await eventService.getEvent(req.params.eventId);
            if (!checkEvent) {
                res.json('Error: this event id is unknow in database').status(404);
            } else {
                await eventService.deleteEvent(checkEvent);
                res.json('Event deleted').status(200);
            }
        }
    }
});


/**
 * @swagger
 * /event/next-events:
 *  get:
 *      tags:
 *          - Event
 *      description: Retourne une liste des prochains évènements
 *      responses:
 *          200:
 *              description: Retourne les informations d'un évènement
 */
eventRouter.get('/next-events', async (req, res) => {
    let nextEvents = await eventService.getNextEvents();
    res.status(200).json(nextEvents);
});

/**
 * @swagger
 * /event/details/{eventId}:
 *  get:
 *      tags:
 *          - Event
 *      description: Retourne les details d'un évènement
 *      parameters:
 *          - in: path
 *            name: eventId
 *            description: id de l'évènement
 *      responses:
 *          201:
 *              description: Retourne les détails d'un évènement
 *          404:
 *              description: Erreurs provenant des paramètres
 */
eventRouter.get('/details/:eventId', async (req, res) => {
    let checkEvent = await eventService.getEvent(req.params.eventId);
    if (!checkEvent) {
        res.json('Error: this event id is unknow in database').status(404);
    } else {
        let bars_from_event = await eventService.getEventDetails(checkEvent);
        res.json({ "event": checkEvent, "bars": bars_from_event }).status(200);
    }
})

/**
 * @swagger
 * /events-sport/{sportId}:
 *  get:
 *      tags:
 *          - Sport
 *      description: Retourne une liste des évènements liées à un sport
 *      parameters:
 *          - in: path
 *            name: sportId
 *            description: id de l'évènement
 *      responses:
 *          201:
 *              description: Retourne une liste des évènements liées à un sport
 *          404:
 *              description: Erreurs provenant des paramètres
 */
eventRouter.get('/events-sport/:sportId', async (req, res) => {
    let checkSportId = await getSport(req.params.sportId);
    if (!checkSportId) {
        res.json('Error: this sport id is unknow in database').status(404);
    } else {
        let eventsFromSport = await eventService.getEventsSport(req.params.sportId);
        res.status(200).json({
            "sport": checkSportId,
            "events": eventsFromSport
        });
    }
})

export default eventRouter;
