import { Router } from "express";
const eventRouter = Router();
import * as eventService from '../services/eventService.js';
import { getSport } from "../services/sportService.js";
import { checkToken } from "../utils/tokens.js";

eventRouter.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let allEvents = await eventService.getEvents();
        res.json(allEvents).status(200);
    }
});

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
                    let newEvent = await eventService.createEvent(req.body.sportId, req.body.eventName, req.body.eventDescription, req.body.eventDate);
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
                        await eventService.updateEvent(checkEventObject, req.body.sportId, req.body.eventName, req.body.eventDescription, req.body.eventDate);
                        res.json('Event updated in database').status(200);
                    }
                }
            }
        }
    }
});

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

eventRouter.get('/next-events', async (req, res) => {
    let nextEvents = await eventService.getNextEvents();
    res.status(200).json(nextEvents);
});

eventRouter.get('/details/:eventId', async (req, res) => {
    let checkEvent = await eventService.getEvent(req.params.eventId);
    if (!checkEvent) {
        res.json('Error: this event id is unknow in database').status(404);
    } else {
        let bars_from_event = await eventService.getEventDetails(checkEvent);
        res.json({ "event": checkEvent, "bars": bars_from_event }).status(200);
    }
})

eventRouter.get('/events-sport/:idSport', async (req, res) => {
    let checkSportId = await getSport(req.params.idSport);
    if (!checkSportId) {
        res.json('Error: this sport id is unknow in database').status(404);
    } else {
        let eventsFromSport = await eventService.getEventsSport(req.params.idSport);
        res.status(200).json({
            "sport": checkSportId,
            "events": eventsFromSport
        });
    }
})

export default eventRouter;
