var express = require('express');
var router = express.Router();
const { QueryTypes } = require('sequelize');

const user = require('../models/user');
const sport = require('../models/sport');
const equipe = require('../models/equipe');
const event = require('../models/event');

const sequelize = require('../utils/database');

/**
 * @swagger
 * 
 *  components:
 *      schema:
 *          user:
 *              type: object
 *              properties: 
 *                  last_name:
 *                      type: string
 *                  first_name: 
 *                      type: string
 *                  email: 
 *                      type: string
 *                  telephone: 
 *                      type: string
 *                  role_id:        
 *                      type: integer
 *          user_fav_sport:
 *              type: object
 *              properties:
 *                  id_sport:
 *                      type: integer
 *          user_fav_equipe:
 *              type: object
 *              properties: 
 *                  id_equipe:
 *                      type: integer
 *          user_event:
 *              type: object
 *              properties:
 *                  id_event:
 *                      type: integer
 */

router.get('/', async (req, res) => {
    let users = await user.findAll();
    res.status(200).json(users);
});

/**
 * @swagger
 * /user/{userId}:
 *  get:
 *      tags: 
 *          - User
 *      description: Retourne les informations d'un utilisateur à partir de son Id
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      responses: 
 *          200:
 *              description: Retourne les informations d'un utilisateur unique
 *          404:
 *              description: L'id utilisateur saisie n'est pas connu ne base de données
 */
router.get('/:userId', async (req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);
    
    if(!aUser) {
        res.json('Error: this userId is unknow').status(404);
        console.log('Error: this userId is unknow');
    } else {
        res.status(200).json(aUser);
    }
});

/**
 * @swagger
 * /user/create:
 *  post:
 *      tags: 
 *          - User
 *      description: Créer un utilisateur
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/user'
 *      responses: 
 *          201:
 *              description: Retourne les informations d'un utilisateur unique
 *          404:
 *              description: Erreurs provenant des paramètres
 *          409:
 *              description: L'utilisateur existe déjà en base de données
 */
router.post('/create', async (req, res) => {
    let userBDD = await user.findOne({ where: { email: req.body.email } });

    if (userBDD) {
        res.status(409).json('User already created');
        console.log('User already created');
    } else {
        const newUser = user.build({
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            email: req.body.email,
            telephone: req.body.telephone,
            role_id: req.body.role
        });
        await newUser.save();

        res.json("User created").status(201);
    }
});


/**
 * @swagger
 * /user/update/{userId}:
 *  put:
 *      tags: 
 *          - User
 *      description: Mettre à jour les informations d'un utilisateurs 
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/user'
 *      responses: 
 *          200:
 *              description: Les inforamtions sont bien enregisté
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.put('/update/:userId', async (req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);

    if (req.body.first_name) {
        aUser.first_name = req.body.first_name;
    }
    if (req.body.last_name) {
        aUser.last_name = req.body.last_name;
    }
    if (req.body.email) {
        aUser.email = req.body.email;
    }
    if (req.body.telephone) {
        aUser.telephone = req.body.telephone;
    }
    if (req.body.role_id) {
        aUser.role_id = req.body.role_id;
    }

    await aUser.save();

    res.json("User is updated").status(200);
});

/**
 * @swagger
 * /user/delete/{userId}:
 *  delete:
 *      tags: 
 *          - User
 *      description: Supprimer un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      responses:
 *          200:
 *              description: L'utilisateur est bien supprimé
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.delete('/delete/:userId', async (req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);

    if (!aUser) {
        res.json('Error: This userId is unknow').status(404);
        console.log('Error: This userId is unknow');
    } else {
        await aUser.destroy();

        res.json("User deleted").status(200);
    }
});


// ROUTE API WITH JOIN FOR FAV SPORT


/**
 * @swagger
 * /user/favorite_sport/{userId}:
 *  get:
 *      tags: 
 *          - User
 *      description: Récupérer les sports favoris d'un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      responses:
 *          200:
 *              description: Les informations sont retournées
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.get('/favorite_sport/:userId', async (req, res) => {
    let { userId } = req.params;

    let aUser = await user.findByPk(userId);
    if (!aUser) {
        res.json("Error: This userId is unknow in database").status(404);
        console.log("Error: This userId is unknow in database");
    } else {
        const favorite_sport_from_user = await sequelize.query(
            "SELECT SPORT.id, SPORT.name FROM SPORT LEFT JOIN FAV_SPORT ON SPORT.id = FAV_SPORT.id_sport LEFT JOIN USER ON FAV_SPORT.id_user = USER.id WHERE USER.id = :id_user",
            {
                replacements: { id_user: userId },
                type: QueryTypes.SELECT
            }
        );
        res.status(200).json(favorite_sport_from_user);
    }
});

/**
 * @swagger
 * /user/favorite_sport/{userId}:
 *  post:
 *      tags: 
 *          - User
 *      description: Ajouter un sport favori à un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/user_fav_sport'
 *      responses:
 *          200:
 *              description: Les informations sont retournées
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.post('/favorite_sport/:userId', async (req, res) => {
    let { userId } = req.params;

    let aUser = await user.findByPk(userId);
    if (!aUser) {
        res.json("Error: This userId is unknow in database").status(404);
        console.log("Error: This userId is unknow in database");
    } else {
        let sportId = req.body.id_sport;
        let check_sportId = await sport.findByPk(sportId);
        if (!check_sportId) {
            res.json("Error: This sportId is unknow in database").status(404);
            console.log("Error: This sportId is unknow in database");
        } else {
            const [result, metadata] = await sequelize.query(
                "SELECT id FROM `FAV_SPORT` WHERE `id_user` = :id_user AND `id_sport` = :id_sport",
                {
                    replacements: { id_user: userId, id_sport: sportId },
                    type: QueryTypes.SELECT
                }
            );
            if (result) {
                res.json("Error: This relation is already in database").status(404);
                console.log("Error: This relation is already in database");
            } else {
                const add_favorite_sport = await sequelize.query(
                    "INSERT INTO `FAV_SPORT`(`id`, `id_user`, `id_sport`) VALUES (null, :id_user, :id_sport)",
                    {
                        replacements: { id_user: userId, id_sport: sportId },
                        type: QueryTypes.INSERT
                    }
                );
                res.json("Relation created").status(201);
                console.log("Ajout d'un sport favori sur un user");
            }


        }

    }
});

/**
 * @swagger
 * /user/favorite_sport/{userId}:
 *  delete:
 *      tags: 
 *          - User
 *      description: Supprimer un sport favori à un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/user_fav_sport'
 *      responses:
 *          200:
 *              description: Les informations sont retournées
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.delete('/favorite_sport/:userId', async (req, res) => {
    let { userId } = req.params;

    let aUser = await user.findByPk(userId);
    if (!aUser) {
        res.json("Error: This userId is unknow in database").status(404);
        console.log("Error: This userId is unknow in database");
    } else {
        let sportId = req.body.id_sport;
        let check_sportId = await sport.findByPk(sportId);
        if (!check_sportId) {
            res.json("Error: This sportId is unknow in database").status(404);
            console.log("Error: This sportId is unknow in database");
        } else {
            const [result, metadata] = await sequelize.query(
                "SELECT id FROM `FAV_SPORT` WHERE `id_user` = :id_user AND `id_sport` = :id_sport",
                {
                    replacements: { id_user: userId, id_sport: sportId },
                    type: QueryTypes.SELECT
                }
            );
            if (!result) {
                res.json("Error: This relation is unknow in database").status(404);
                console.log("Error: This relation is unknow in database");
            } else {
                const add_favorite_sport = await sequelize.query(
                    "DELETE FROM `FAV_SPORT` WHERE `id` = :id",
                    {
                        replacements: { id: result["id"] },
                        type: QueryTypes.DELETE
                    }
                );
                res.json("Relation deleted").status(200);
                console.log("Suppresion d'un sport favori sur un user");
            }
        }
    }
});

// ROUTE API WITH JOIN FOR FAV TEAMS

/**
 * @swagger
 * /user/favorite_teams/{userId}:
 *  get:
 *      tags: 
 *          - User
 *      description: Récupérer les équipes favorites d'un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      responses:
 *          200:
 *              description: Les informations sont retournées
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.get('/favorite_teams/:userId', async (req, res) => {
    let { userId } = req.params;

    let aUser = await user.findByPk(userId);
    if (!aUser) {
        res.json("Error: This userId is unknow in database").status(404);
        console.log("Error: This userId is unknow in database");
    } else {
        const favorite_sport_from_user = await sequelize.query(
            "SELECT EQUIPE.id, EQUIPE.name FROM EQUIPE LEFT JOIN FAV_EQUIPE ON EQUIPE.id = FAV_EQUIPE.id_equipe LEFT JOIN USER ON FAV_EQUIPE.id_user = USER.id WHERE USER.id = :id_user",
            {
                replacements: { id_user: userId },
                type: QueryTypes.SELECT
            }
        );
        res.status(200).json(favorite_sport_from_user);
    }
});

/**
 * @swagger
 * /user/favorite_teams/{userId}:
 *  post:
 *      tags: 
 *          - User
 *      description: Ajouter une équipe favorite à un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/user_fav_equipe'
 *      responses:
 *          200:
 *              description: Les informations sont retournées
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.post('/favorite_teams/:userId', async (req, res) => {
    let { userId } = req.params;

    let aUser = await user.findByPk(userId);
    if (!aUser) {
        res.json("Error: This userId is unknow in database").status(404);
        console.log("Error: This userId is unknow in database");
    } else {
        let equipeId = req.body.id_equipe;
        let check_equipeId = await equipe.findByPk(equipeId);
        if (!check_equipeId) {
            res.json("Error: This equipeId is unknow in database").status(404);
            console.log("Error: This equipeId is unknow in database");
        } else {
            const [result, metadata] = await sequelize.query(
                "SELECT id FROM `FAV_EQUIPE` WHERE `id_user` = :id_user AND `id_equipe` = :id_equipe",
                {
                    replacements: { id_user: userId, id_equipe: equipeId },
                    type: QueryTypes.SELECT
                }
            );
            if (result) {
                res.json("Error: This relation is already in database").status(404);
                console.log("Error: This relation is already in database");
            } else {
                const add_favorite_equipe = await sequelize.query(
                    "INSERT INTO `FAV_EQUIPE`(`id`, `id_user`, `id_equipe`) VALUES (null, :id_user, :id_equipe)",
                    {
                        replacements: { id_user: userId, id_equipe: equipeId },
                        type: QueryTypes.INSERT
                    }
                );
                res.json("Relation created").status(201);
                console.log("Ajout d'un sport favori sur un user");
            }
        }
    }
});

/**
 * @swagger
 * /user/favorite_teams/{userId}:
 *  delete:
 *      tags: 
 *          - User
 *      description: Supprime une équipe favorite d'un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/user_fav_equipe'
 *      responses:
 *          200:
 *              description: Les informations sont retournées
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.delete('/favorite_teams/:userId', async (req, res) => {
    let { userId } = req.params;

    let aUser = await user.findByPk(userId);
    if (!aUser) {
        res.json("Error: This userId is unknow in database").status(404);
        console.log("Error: This userId is unknow in database");
    } else {
        let equipeId = req.body.id_equipe;
        let check_equipeId = await equipe.findByPk(equipeId);
        if (!check_equipeId) {
            res.json("Error: This equipeId is unknow in database").status(404);
            console.log("Error: This equipeId is unknow in database");
        } else {
            const [result, metadata] = await sequelize.query(
                "SELECT id FROM `FAV_EQUIPE` WHERE `id_user` = :id_user AND `id_equipe` = :id_equipe",
                {
                    replacements: { id_user: userId, id_equipe: equipeId },
                    type: QueryTypes.SELECT
                }
            );
            if (!result) {
                res.json("Error: This relation is unknow in database").status(404);
                console.log("Error: This relation is unknow in database");
            } else {
                const add_favorite_sport = await sequelize.query(
                    "DELETE FROM `FAV_EQUIPE` WHERE `id` = :id",
                    {
                        replacements: { id: result["id"] },
                        type: QueryTypes.DELETE
                    }
                );
                res.json("Relation deleted").status(200);
                console.log("Suppresion d'un sport favori sur un user");
            }
        }
    }
});

// ROUTE API WITH JOIN FOR EVENTS

/**
 * @swagger
 * /user/events/{userId}:
 *  get:
 *      tags: 
 *          - User
 *      description: Récupère les évènements d'un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      responses:
 *          200:
 *              description: Les informations sont retournées
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.get('/events/:userId', async (req, res) => {
    let { userId } = req.params;

    let aUser = await user.findByPk(userId);
    if (!aUser) {
        res.json("Error: This userId is unknow in database").status(404);
        console.log("Error: This userId is unknow in database");
    } else {
        const favorite_sport_from_user = await sequelize.query(
            "SELECT EVENT.id, EVENT.name, EVENT.description FROM EVENT LEFT JOIN USER_EVENT ON EVENT.id = USER_EVENT.id_event LEFT JOIN USER ON USER_EVENT.id_user = USER.id WHERE USER.id = :id_user",
            {
                replacements: { id_user: userId },
                type: QueryTypes.SELECT
            }
        );
        res.status(200).json(favorite_sport_from_user);
    }
});

/**
 * @swagger
 * /user/events/{userId}:
 *  post:
 *      tags: 
 *          - User
 *      description: Ajoute un évènement à un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/user_event'
 *      responses:
 *          200:
 *              description: Les informations sont retournées
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.post('/events/:userId', async (req, res) => {
    let { userId } = req.params;

    let aUser = await user.findByPk(userId);
    if (!aUser) {
        res.json("Error: This userId is unknow in database").status(404);
        console.log("Error: This userId is unknow in database");
    } else {
        let eventId = req.body.id_event;
        let check_eventId = await event.findByPk(eventId);
        if (!check_eventId) {
            res.json("Error: This eventId is unknow in database").status(404);
            console.log("Error: This eventId is unknow in database");
        } else {
            const [result, metadata] = await sequelize.query(
                "SELECT id FROM `USER_EVENT` WHERE `id_user` = :id_user AND `id_event` = :id_event",
                {
                    replacements: { id_user: userId, id_event: eventId },
                    type: QueryTypes.SELECT
                }
            );
            if (result) {
                res.json("Error: This relation is already in database").status(404);
                console.log("Error: This relation is already in database");
            } else {
                const user_participe_event = await sequelize.query(
                    "INSERT INTO `USER_EVENT`(`id`, `id_user`, `id_event`) VALUES (null, :id_user, :id_event)",
                    {
                        replacements: { id_user: userId, id_event: eventId },
                        type: QueryTypes.INSERT
                    }
                );
                res.json("Relation created").status(201);
                console.log("Un user participe à un évènement");
            }
        }
    }
});

/**
 * @swagger
 * /user/events/{userId}:
 *  delete:
 *      tags: 
 *          - User
 *      description: Supprime un évènement d'un utilisateur
 *      parameters: 
 *          - in: path
 *            name: userId
 *            description: id de l'utilisateur
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/user_event'
 *      responses:
 *          200:
 *              description: Les informations sont retournées
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.delete('/events/:userId', async (req, res) => {
    let { userId } = req.params;

    let aUser = await user.findByPk(userId);
    if (!aUser) {
        res.json("Error: This userId is unknow in database").status(404);
        console.log("Error: This userId is unknow in database");
    } else {
        let eventId = req.body.id_event;
        let check_eventId = await event.findByPk(eventId);
        if (!check_eventId) {
            res.json("Error: This eventId is unknow in database").status(404);
            console.log("Error: This eventId is unknow in database");
        } else {
            const [result, metadata] = await sequelize.query(
                "SELECT id FROM `USER_EVENT` WHERE `id_user` = :id_user AND `id_event` = :id_event",
                {
                    replacements: { id_user: userId, id_event: eventId },
                    type: QueryTypes.SELECT
                }
            );
            if (!result) {
                res.json("Error: This relation is unknow in database").status(404);
                console.log("Error: This relation is unknow in database");
            } else {
                const delete_participation = await sequelize.query(
                    "DELETE FROM `USER_EVENT` WHERE `id` = :id",
                    {
                        replacements: { id: result["id"] },
                        type: QueryTypes.DELETE
                    }
                );
                res.json("Relation deleted").status(200);
                console.log("Suppresion d'un sport favori sur un user");
            }
        }
    }
});

module.exports = router;
