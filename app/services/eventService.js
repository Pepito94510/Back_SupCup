import { QueryTypes } from 'sequelize';
import sequelize from "../utils/database.js";
import event from "../models/eventModel.js";
import Sequelize from 'sequelize';
const op = Sequelize.Op;

export async function getEvents() {
    let allEvents = await event.findAll();
    return allEvents;
}

export async function getEvent(eventId) {
    let oneEvent = await event.findByPk(eventId);
    return oneEvent;
}

export async function createEvent(sportId, eventName, EventDescription, EventDate) {
    const newEvent = event.build({
        id_sport: sportId,
        name: eventName,
        description: EventDescription,
        date_event: EventDate
    });
    await newEvent.save();
    return newEvent;
}

export async function updateEvent(eventObject, eventSportId, eventName, EventDescription, EventDate) {
    eventObject.id_sport = eventSportId
    eventObject.name = eventName;
    eventObject.description = EventDescription;
    eventObject.date_event = EventDate
    await eventObject.save();
    return eventObject;
}

export async function deleteEvent(eventObject) {
    await eventObject.destroy();
    return true;
}

export async function getNextEvents() {
    let events = await event.findAll({ where: { date_event: { [op.gte]: new Date().toISOString().split('T')[0] } }, limit: 8, order: [['date_event', 'ASC']] });
    return events
}

export async function getEventDetails(eventObject) {
    const bars_from_event = await sequelize.query(
        "SELECT BAR.id, BAR.name, BAR.address, BAR.postcode, BAR.city, BAR.mail, BAR.description FROM BAR LEFT JOIN BAR_EVENT ON BAR.id = BAR_EVENT.id_bar LEFT JOIN EVENT ON EVENT.id = BAR_EVENT.id_event WHERE EVENT.id = :id_event;",
        {
            replacements: { id_event: eventObject.eventId },
            type: QueryTypes.SELECT
        }
    );
    return bars_from_event;
}

export async function getEventsSport(idSport) {
    const events_from_sports = await sequelize.query(
        "SELECT EVENT.name, EVENT.id, EVENT.description, EVENT.date_event FROM SPORT LEFT JOIN EVENT ON EVENT.id_sport = SPORT.id WHERE SPORT.id = :id_sport;",
        {
            replacements: { id_sport: idSport },
            type: QueryTypes.SELECT
        }
    );
    return events_from_sports;
}

export async function getEventsUser(userId) {
    const eventUser = await sequelize.query(
        "SELECT EVENT.id, EVENT.name, EVENT.description FROM EVENT LEFT JOIN USER_EVENT ON EVENT.id = USER_EVENT.id_event LEFT JOIN USER ON USER_EVENT.id_user = USER.id WHERE USER.id = :id_user",
        {
            replacements: { id_user: userId },
            type: QueryTypes.SELECT
        }
    );
    return eventUser;
}

export async function checkEventUserRelation(userId, eventId) {
    const [result, metadata] = await sequelize.query(
        "SELECT id FROM `USER_EVENT` WHERE `id_user` = :id_user AND `id_event` = :id_event",
        {
            replacements: { id_user: userId, id_event: eventId },
            type: QueryTypes.SELECT
        }
    );
    return result;
}

export async function createEventUserRelation(userId, eventId) {
    const user_participe_event = await sequelize.query(
        "INSERT INTO `USER_EVENT`(`id`, `id_user`, `id_event`) VALUES (null, :id_user, :id_event)",
        {
            replacements: { id_user: userId, id_event: eventId },
            type: QueryTypes.INSERT
        }
    );
    return user_participe_event
}

export async function deleteEventUserRelation(relationId) {
    const delete_participation = await query(
        "DELETE FROM `USER_EVENT` WHERE `id` = :id",
        {
            replacements: { id: result["id"] },
            type: QueryTypes.DELETE
        }
    );
    return delete_participation;
}
