import { Router } from "express";
const barRouter = Router();
import { checkToken, createTokenFromData } from "../utils/tokens.js";
import * as barService from "../services/barService.js"
import { getUser } from "../services/userService.js";
import * as eventService from "../services/eventService.js"

barRouter.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.status(404).json('Error: token is required');
    } else {
        //ajouter check TOKEN > 3
        let allBars = await barService.getBars();
        res.json(allBars).status(200);
    }
});

barRouter.get('/:barId', async (req, res) => {
    if (!req.headers.token) {
        res.status(404).json('Error: token is required');
    } else {
        //ajouter check TOKEN > 3
        let oneBar = await barService.getBar(req.params.barId);
        if (!oneBar) {
            res.status(404).json('Error: This bar id is unknow in database');
        } else {
            res.status(200).json(oneBar);
        }
    }
});

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

barRouter.post('/events/:barId', async (req,res) => {
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
                        console.log(checkRelation);
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

barRouter.delete('/events/:barId', async (req,res) => {
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
                        console.log(checkRelation);
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

export default barRouter;
