import { Router } from "express";
const barRouter = Router();
import { checkToken } from "../utils/tokens.js";
import * as barService from "../services/barService.js"
import { getUser } from "../services/userService.js";
import * as eventService from "../services/eventService.js"

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
 *                  id_user:
 *                      type: integer
 *                  image:
 *                      type: string
 *          bar_event:
 *              type: object
 *              properties:
 *                  eventId:
 *                      type: integer
 */

barRouter.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let allBars = await barService.getBars();
        res.json(allBars).status(200);
    }
});

/**
 * @swagger
 * /bar/find-one/{barId}:
 *  get:
 *      tags:
 *          - Bar
 *      description: Retourne les informations d'un bar en fonction de son id
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *          - in: headers
 *            name: token
 *            description: token d'acces
 *      responses:
 *          200:
 *              description: Retourne les informations d'un bar
 *          404:
 *              description: L'id bar saisie n'est pas connu ne base de données
 */
barRouter.get('/find-one/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let oneBar = await barService.getBar(req.params.barId);
        if (!oneBar) {
            res.json('Error: This bar id is unknow in database').status(404);
        } else {
            res.json(oneBar).status(200);
        }
    }
});

/**
 * @swagger
 * /bar/create:
 *  post:
 *      tags:
 *          - Bar
 *      description: Créer un bar
 *      parameters:
 *          - in: headers
 *            name: token
 *            description: token d'acces
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
barRouter.post('/create', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        if (!req.body.barName || !req.body.barAddress ||
            !req.body.barPostCode || !req.body.barCity ||
            !req.body.barMail || !req.body.barUserId ||
            !req.body.barDescription) {
            res.json('Error: Some keys are required').status(404);
        } else {
            let checkUserId = await getUser(req.body.barUserId);
            if (!checkUserId) {
                res.json('Error: this user id is unknow in database').status(404);
            } else {
                let newBar = await barService.createBar(req.body.barName, req.body.barAddress, req.body.barPostCode,
                    req.body.barCity, req.body.barMail, req.body.barUserId, req.body.barDescription, req.body.barImage);
                res.json(newBar).status(201);
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
 *      description: Modifie les informations d'un bar
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *          - in: headers
 *            name: token
 *            description: token d'acces
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
barRouter.put('/update/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        if (!req.body.barName || !req.body.barAddress ||
            !req.body.barPostCode || !req.body.barCity ||
            !req.body.barMail || !req.body.barUserId ||
            !req.body.barDescription) {
            res.json('Error: Some keys are required').status(404);
        } else {
            let checkBarId = await barService.getBar(req.params.barId);
            if (!checkBarId) {
                res.json('Error: This bar id is unknow in database').status(404);
            } else {
                let checkUserId = await getUser(req.body.barUserId);
                if (!checkUserId) {
                    res.json('Error: This user id is unknow in database').status(404);
                } else {
                    let barUpdated = await barService.updateBar(req.params.barId, req.body.barName, req.body.barAddress,
                        req.body.barPostCode, req.body.barCity, req.body.barMail, req.body.barUserId, req.body.barDescription, req.body.barImage);
                    res.json(barUpdated).status(200);
                }
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
 *      description: Supprime les informations d'un bar par son Id
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *          - in: headers
 *            name: token
 *            description: token d'acces
 *      responses:
 *          200:
 *              description: Supprime un bar
 *          404:
 *              description: Erreurs provenant des paramètres
 */
barRouter.delete('/delete/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        let checkBarId = await barService.getBar(req.params.barId);
        if (!checkBarId) {
            res.json('Error: This bar id is unknow in database').status(404);
        } else {
            await barService.deleteBar(checkBarId);
            res.json('Bar deleted').status(200);
        }
    }
});

// ROUTE API WITH JOIN FOR EVENTS

/**
 * @swagger
 * /bar/events/{barId}:
 *  get:
 *      tags:
 *          - Bar-Evénement
 *      description: Récupère les évènements liés à un bar
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *          - in: headers
 *            name: token
 *            description: token d'acces
 *      responses:
 *          200:
 *              description: Récupère les évènements liés à un bar
 *          404:
 *              description: Erreurs provenant des paramètres
 */
barRouter.get('/events/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            let barObject = await barService.getBar(req.params.barId);
            if (!barObject) {
                res.json('Error: This barId is unknow in database').status(404);
            } else {
                let eventsBar = await barService.getEventsBar(req.params.barId);
                res.json(eventsBar).status(200);
            }
        }
    }
});

/**
 * @swagger
 * /bar/events/{barId}:
 *  post:
 *      tags:
 *          - Bar-Evénement
 *      description: Ajoute un évènement à un bar
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *            type: integer
 *          - in: headers
 *            name: token
 *            description: token d'acces
 *          - in: formData
 *            name: eventId
 *            description: id de l'evenement
 *            type: integer
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
barRouter.post('/events/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            if (!req.params.barId) {
                res.json('Error: barId is required').status(404);
            } else {
                let barObject = await barService.getBar(req.params.barId);
                if (!barObject) {
                    res.json('Error: This barId is unknow in database').status(404);
                } else {
                    let checkEventId = await eventService.getEvent(req.body.eventId)
                    if (!checkEventId) {
                        res.json('Error: this eventId is unknow in database').status(404);
                    } else {
                        let checkRelation = await barService.checkBarEventRelation(req.params.barId, req.body.eventId);
                        if (checkRelation) {
                            res.json('Error: This relation is already in database').status(404);
                        } else {
                            let createRelation = await barService.createBarEvent(req.params.barId, req.body.eventId);
                            res.json('Relation created').status(201);
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
 *          - Bar-Evénement
 *      description: Supprime un évènement liée à un bar
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *          - in: headers
 *            name: token
 *            description: token d'acces
 *          - in: body
 *            name: eventId
 *            description: id de l'evenement
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
barRouter.delete('/events/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            if (!req.params.barId) {
                res.json('Error: barId is required').status(404);
            } else {
                let barObject = await barService.getBar(req.params.barId);
                if (!barObject) {
                    res.json('Error: This barId is unknow in database').status(404);
                } else {
                    let checkEventId = await eventService.getEvent(req.body.eventId)
                    if (!checkEventId) {
                        res.json('Error: this eventId is unknow in database').status(404);
                    } else {
                        let checkRelation = await barService.checkBarEventRelation(req.params.barId, req.body.eventId);
                        if (!checkRelation) {
                            res.json('Error: This relation is unknow in database').status(404);
                        } else {
                            let createRelation = await barService.deleteBarEvent(checkRelation.id);
                            res.json('Relation deleted').status(201);
                        }
                    }
                }
            }
        }
    }
});

/**
 * @swagger
 * /bar/top-bars:
 *  get:
 *      tags:
 *          - Bar
 *      description: Retourne les top bars du moment
 *      responses:
 *          200:
 *              description: Retourne la liste des bars
 */
barRouter.get('/top-bars', async (req, res) => {
    let bars = await barService.getTopBars();
    if(!bars) {
        res.status(200).json("We don't have any bars in database");
    }
    res.status(200).json(bars);
});

/**
 * @swagger
 * /bar/details/{barId}:
 *  get:
 *      tags:
 *          - Bar
 *      description: Retourne des detail sur le bar par son Id
 *      parameters:
 *          - in: path
 *            name: barId
 *            description: id du bar
 *      responses:
 *          200:
 *              description: Retourne les details d'un bar
 *          404:
 *              description: L'id bar saisie n'est pas connu ne base de données
 */
barRouter.get('/details/:barId', async (req, res) => {
    let { barId } = req.params;
    let aBar = await barService.getBar(barId);
    if (!aBar) {
        res.json("Error: This barId is unknow in database").status(404);
        console.log("Error: This barId is unknow in database");
    } else {
        const events_from_bar = await barService.getBarDetails(barId);
        res.status(200).json({"bar": aBar, "events": events_from_bar});
    }
});

export default barRouter;
