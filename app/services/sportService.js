import { QueryTypes } from 'sequelize';
import sequelize from "../utils/database.js";
import sport from "../models/sportModel.js";

export async function getSports() {
    let sports = await sport.findAll();
    return sports;
}

export async function getSport(sportId) {
    console.log(sportId);
    let oneSport = await sport.findByPk(sportId);
    return oneSport;
}

export async function createSport(sportName) {
    const newSport = sport.build({
        name: sportName
    })
    await newSport.save();
    return newSport;
}

export async function updateSport(sportId, sportName) {
    let sportObject = await getSport(sportId);
    sportObject.name = sportName;
    sportObject.save();
    return sportObject;
}

export async function deleteSport(sportId) {
    let sportObject = await getSport(sportId);
    await sportObject.destroy();
    return true;
}

export async function getTopSports(limit, order) {
    let topSports = await sport.findAll({limit: limit, order: order});
    return topSports;
}
