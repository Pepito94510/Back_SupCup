import { QueryTypes } from 'sequelize';
import sequelize from "../utils/database.js";
import bar from "../models/barModel.js";

export async function getBars() {
    let bars = await bar.findAll();
    return bars;
}

export async function getBar(barId) {
    let oneBar = await bar.findByPk(barId)
    return oneBar;
}

export async function createBar(barName, barAddress, barPostCode, barCity,
    barMail, barUserId, barDescription = '') {
    const newBar = bar.build({
        name: barName,
        address: barAddress,
        postcode: barPostCode,
        city: barCity,
        mail: barMail,
        id_user: barUserId,
        description: barDescription
    })
    await newBar.save();
    return newBar;
}

export async function updateBar(barId, barName, barAddress, barPostCode, barCity,
    barMail, barUserId, barDescription = '') {
    let barObject = await getBar(barId);
    barObject.name = barName;
    barObject.address = barAddress;
    barObject.postcode = barPostCode;
    barObject.city = barCity;
    barObject.mail = barMail;
    barObject.id_user = barUserId;
    barObject.description = barDescription;

    barObject.save();
    return barObject;
}

export async function deleteBar(barObject) {
    await barObject.destroy();
    return true;
}

export async function getEventsBar(barId) {
    const events_from_bar = await sequelize.query(
        "SELECT EVENT.id as eventId, EVENT.name as eventName, EVENT.description as eventDescription, EVENT.date_event as eventDate, SPORT.name as sportName FROM EVENT LEFT JOIN BAR_EVENT ON EVENT.id = BAR_EVENT.id_event LEFT JOIN BAR ON BAR_EVENT.id_bar = BAR.id LEFT JOIN SPORT ON SPORT.id = EVENT.id_sport WHERE BAR.id = :id_bar",
        {
            replacements: { id_bar: barId },
            type: QueryTypes.SELECT
        }
    );
    return events_from_bar;
}

export async function checkBarEventRelation(barId, eventId) {
    const [result, metadata] = await sequelize.query(
        "SELECT id FROM `BAR_EVENT` WHERE `id_bar` = :id_bar AND `id_event` = :id_event",
        {
            replacements: { id_bar: barId, id_event: eventId },
            type: QueryTypes.SELECT
        }
    );
    return result;
}

export async function createBarEvent(barId, eventId) {
    const bar_participe_event = await sequelize.query(
        "INSERT INTO `BAR_EVENT`(`id`, `id_bar`, `id_event`) VALUES (null, :id_bar, :id_event)",
        {
            replacements: { id_bar: barId, id_event: eventId },
            type: QueryTypes.INSERT
        }
    );
    return bar_participe_event;
}

export async function deleteBarEvent(relationId) {
    const delete_participation = await sequelize.query(
        "DELETE FROM `BAR_EVENT` WHERE `id` = :id",
        {
            replacements: { id: relationId },
            type: QueryTypes.DELETE
        }
    );
    return delete_participation
}
