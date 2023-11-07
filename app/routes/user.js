var express = require('express');
var router = express.Router();
const { QueryTypes } = require('sequelize');


const user = require('../models/user');
const sport = require('../models/sport');
const equipe = require('../models/equipe');
const event = require('../models/event');

const sequelize = require('../utils/database');

router.get('/', async (req, res) => {
    let users = await user.findAll();
    res.status(200).json(users);
});

router.get('/:userId', async (req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);
    res.status(200).json(aUser);
});

router.post('/create', async (req, res) => {
    let userBDD = await user.findOne({ where: { email: req.body.email } });

    if (userBDD) {
        res.status(200).json('User already created');
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
    if (req.body.role) {
        aUser.role_id = req.body.role;
    }

    await aUser.save();

    res.json("User is updated").status(200);
});

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
