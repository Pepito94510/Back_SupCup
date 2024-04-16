import { QueryTypes } from 'sequelize';
import sequelize from "../utils/database.js";
import equipe from "../models/equipeModel.js";

export async function getEquipes() {
    let equipes = await equipe.findAll();
    return equipes;
}

export async function getEquipe(equipeId) {
    let oneEquipe = await equipe.findByPk(equipeId)
    return oneEquipe;
}

export async function createEquipe(equipeSport, equipeName, equipeLogo = '') {
    const newEquipe = equipe.build({
        id_sport: equipeSport,
        name: equipeName,
        logo: equipeLogo
    })
    await newEquipe.save();
    return newEquipe;
}

export async function updateEquipe(equipeId, sportId, equipeName, equipeLogo = '') {
    let equipeObject = await getEquipe(equipeId);
    equipeObject.id_sport = sportId;
    equipeObject.name = equipeName;
    equipeObject.logo = equipeLogo;
    equipeObject.save();
    return equipeObject;
}

export async function deleteEquipe(equipeId) {
    let equipeObject = await getEquipe(equipeId);
    await equipeObject.destroy();
    return true;
}

export async function getEquipeNameByName(equipeName, sportId) {
    let equipeObject = await equipe.findOne({ where: { name: equipeName, id_sport: sportId } })
    return equipeObject;
}
