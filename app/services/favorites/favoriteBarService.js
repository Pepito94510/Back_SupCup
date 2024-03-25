import { QueryTypes } from 'sequelize';
import sequelize from "../../utils/database.js";

export async function getFavoriteBars(userId) {
    let favorite_bar = await sequelize.query(
        "SELECT * FROM `BAR` b LEFT JOIN `FAV_BAR` fb ON fb.id_bar = b.id WHERE fb.id_user = :idUser",
        {
            replacements: { idUser: userId },
            type: QueryTypes.SELECT
        }
    );
    return favorite_bar;
}

export async function checkUserBarRelation(userId, barId) {
    let checkRelation = await sequelize.query(
        "SELECT id FROM `FAV_BAR` WHERE `id_user` = :idUser AND `id_bar` = :idBar",
        {
            replacements: { idUser: userId, idBar: barId },
            type: QueryTypes.SELECT
        }
    );
    return checkRelation;
}

export async function addFavoriteBar(userId, barId) {
    let checkRelation = await sequelize.query(
        "INSERT INTO `FAV_BAR`(`id`, `id_user`, `id_bar`) VALUES (null, :idUser, :idBar)",
        {
            replacements: { idUser: userId, idBar: barId },
            type: QueryTypes.INSERT
        }
    );
    return checkRelation;
}

export async function deleteFavoriteBar(relationId) {
    console.log(relationId);
    let checkRelation = await sequelize.query(
        "DELETE FROM `FAV_BAR` WHERE id = :idRelation",
        {
            replacements: { idRelation: relationId},
            type: QueryTypes.DELETE
        }
    );
    return checkRelation;
}
