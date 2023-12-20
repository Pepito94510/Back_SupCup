var express = require('express');
var router = express.Router();

const sport = require('../models/sport');
const { checkToken } = require('../utils/tokens');

/**
 * @swagger
 * 
 *  components:
 *      schema:
 *          sport:
 *              type: object
 *              properties: 
 *                  name:
 *                      type: string
 */

router.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 3) {
                let sports = await sport.findAll();
                res.status(200).json(sports);
            }
        }
    }
});

/**
 * @swagger
 * /sports/{sportId}:
 *  get:
 *      tags: 
 *          - Sport
 *      description: Retourne les informations d'un sport en fonction de son id
 *      parameters: 
 *          - in: path
 *            name: sportId
 *            description: id du sport
 *      responses: 
 *          200:
 *              description: Retourne les informations d'un sport
 *          404:
 *              description: L'id sport saisie n'est pas connu ne base de données
 */
router.get('/:sportId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 1) {
                let { sportId } = req.params;
                let aSport = await sport.findByPk(sportId);
                res.status(200).json(aSport);
            }
        }
    }
});

/**
 * @swagger
 * /sport/create:
 *  post:
 *      tags: 
 *          - Sport
 *      description: Créer un sport
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/sport'
 *      responses: 
 *          201:
 *              description: Créer un nouveau sport
 *          404:
 *              description: Erreurs provenant des paramètres
 *          409:
 *              description: Le sport existe déjà en base de données
 */
router.post('/create', async (req, res) => {
    if (req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 3) {
                if (!req.body.name) {
                    res.json('Error: check your parameters. name is required').status(404);
                    console.log('Error: name is missing in parameters');
                } else {
                    // transform string on lowercase
                    let new_sport = req.body.name.toString().toLowerCase();

                    // check if sport is already in BDD
                    let check_sport = await sport.findOne({ where: { name: new_sport } });

                    if (check_sport) {
                        res.status(200).json(req.body.name + ' already created');
                        console.log(req.body.name + ' already created');
                    } else {
                        const newSport = sport.build({
                            name: new_sport,
                        });
                        await newSport.save();

                        res.json("Sport : " + req.body.name + " created");
                    }
                }
            }
        }
    }
});

/**
 * @swagger
 * /sport/update:
 *  put:
 *      tags: 
 *          - Sport
 *      description: Modifie un sport
 *      parameters: 
 *          - in: path
 *            name: equipeId
 *            description: id de l'équipe
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/sport'
 *      responses: 
 *          201:
 *              description: Modifie un sport
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.put('/update/:sportId', async (req, res) => {

    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            if (tokenOk.role_id >= 3) {
                // check all params
                let { sportId } = req.params;

                // check if name is not empty
                if (!req.body.name) {
                    res.json('Error: no value');
                    console.log('Error: no value');
                } else {
                    let sport_update = req.body.name.toString().toLowerCase();

                    // check if value is ok with database
                    let aSport = await sport.findByPk(sportId);
                    let checkAllSports = await sport.findOne({ where: { name: sport_update } })

                    if (!aSport) {
                        console.log('sport not found');
                        res.json("Error: sport not found").status(404);
                    } else if (checkAllSports) {
                        res.json(sport_update + ' is already in database').status(200);
                        console.log(sport_update + ' is already in database');
                    } else {
                        aSport.name = sport_update;
                        await aSport.save();

                        res.json('sport updated').status(200);
                    }
                }
            }
        }
    }
});

/**
 * @swagger
 * /sport/delete:
 *  delete:
 *      tags: 
 *          - Sport
 *      description: Supprime un sport
 *      parameters: 
 *          - in: path
 *            name: equipeId
 *            description: id de l'équipe
 *      responses: 
 *          201:
 *              description: Supprime un sport
 *          404:
 *              description: Erreurs provenant des paramètres
 */
router.delete('/delete/:sportId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        let token = req.headers.token;
        const tokenOk = checkToken(token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            if (tokenOk.role_id >= 3) {
                let { sportId } = req.params;
                let aSport = await sport.findByPk(sportId);

                if (!aSport) {
                    res.json('Error: This sportId is unknow').status(404);
                    console.log('Error: This sportId is unknow');
                } else {
                    await aSport.destroy();

                    res.json("Sport deleted").status(200);
                }
            }
        }
    }
});

module.exports = router;
