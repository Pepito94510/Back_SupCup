import { QueryTypes } from 'sequelize';
import sequelize from "../../utils/database.js";
import user from "../../models/userModel.js";
import { getUser } from '../userService.js';

export async function getFavoriteSport(userId) {
    let userObject = await getUser(userId);
    if(!userObject) {
        return null
    } else {
        const favorite_sport_from_user = await sequelize.query(
            "SELECT SPORT.id, SPORT.name FROM SPORT LEFT JOIN FAV_SPORT ON SPORT.id = FAV_SPORT.id_sport LEFT JOIN USER ON FAV_SPORT.id_user = USER.id WHERE USER.id = :id_user",
            {
                replacements: { id_user: userId },
                type: QueryTypes.SELECT
            }
        );
        return favorite_sport_from_user;
    }
}

export async function addFavoriteSport(userId, sportId) {
    const add_favorite_sport = await sequelize.query(
        "INSERT INTO `FAV_SPORT`(`id`, `id_user`, `id_sport`) VALUES (null, :id_user, :id_sport)",
        {
            replacements: { id_user: userId, id_sport: sportId },
            type: QueryTypes.INSERT
        }
    );
    return add_favorite_sport;
}

export async function checkUserSportRelation(userId, sportId) {
    const [result, metadata] = await sequelize.query(
        "SELECT id FROM `FAV_SPORT` WHERE `id_user` = :id_user AND `id_sport` = :id_sport",
        {
            replacements: { id_user: userId, id_sport: sportId },
            type: QueryTypes.SELECT
        }
    );
    return result;
}

export async function deleteFavoriteSport(relationId) {
    const delete_favorite_sport = await sequelize.query(
        "DELETE FROM `FAV_SPORT` WHERE `id` = :id",
        {
            replacements: { id: relationId  },
            type: QueryTypes.DELETE
        }
    );
    return delete_favorite_sport;
}
