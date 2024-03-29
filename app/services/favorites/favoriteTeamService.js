import { QueryTypes } from 'sequelize';
import sequelize from "../../utils/database.js";
import user from "../../models/userModel.js";
import { getUser } from '../userService.js';

export async function getFavoriteTeams(userId) {
    const favorite_sport_from_user = await sequelize.query(
        "SELECT * FROM `EQUIPE` e LEFT JOIN `FAV_EQUIPE` fe ON fe.id_equipe = e.id WHERE fe.id_user = :id_user",
        {
            replacements: { id_user: userId },
            type: QueryTypes.SELECT
        }
    );
    return favorite_sport_from_user;
}

export async function addFavoriteTeams(userId, equipeId) {
    const add_favorite_equipe = await sequelize.query(
        "INSERT INTO `FAV_EQUIPE`(`id`, `id_user`, `id_equipe`) VALUES (null, :id_user, :id_equipe)",
        {
            replacements: { id_user: userId, id_equipe: equipeId },
            type: QueryTypes.INSERT
        }
    );
    return add_favorite_equipe
}

export async function checkUserTeamRelation(userId, equipeId) {
    const [result, metadata] = await sequelize.query(
        "SELECT id FROM `FAV_EQUIPE` WHERE `id_user` = :id_user AND `id_equipe` = :id_equipe",
        {
            replacements: { id_user: userId, id_equipe: equipeId },
            type: QueryTypes.SELECT
        }
    );
    return result;
}

export async function deleteFavoriteTeam(relationId) {
    const delete_favorite_team = await sequelize.query(
        "DELETE FROM `FAV_EQUIPE` WHERE `id` = :id",
        {
            replacements: { id: relationId },
            type: QueryTypes.DELETE
        }
    );
    return
}
