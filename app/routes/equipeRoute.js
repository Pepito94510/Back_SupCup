import { Router } from "express";
const equipeRouter = Router();
import * as equipeService from '../services/equipeService.js';
import { getSport } from "../services/sportService.js";
import { checkToken } from "../utils/tokens.js";

/**
 * @swagger
 *
 *  components:
 *      schema:
 *          equipe:
 *              type: object
 *              properties:
 *                  id_sport:
 *                      type: integer
 *                  name:
 *                      type: string
 *                  logo:
 *                      type: string
 */

equipeRouter.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let allEquipes = await equipeService.getEquipes();
        res.json(allEquipes).status(200);
    }
});


/**
 * @swagger
 * /equipe/find-one/{equipeId}:
 *  get:
 *      tags:
 *          - Equipe
 *      description: Retourne les informations d'une équipe en fonction de son id
 *      parameters:
 *          - in: path
 *            name: equipeId
 *            description: id de l'équipe
 *      responses:
 *          200:
 *              description: Retourne les informations d'une équipe
 *          404:
 *              description: L'id équipe saisie n'est pas connu ne base de données
 */
equipeRouter.get('/find-one/:equipeId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: this token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let oneEquipe = await equipeService.getEquipe(req.params.equipeId);
        if (!oneEquipe) {
            res.json('Error: no equipe found with this Id').status(404);
        } else {
            res.json(oneEquipe).status(200);
        }
    }
});

/**
 * @swagger
 * /equipe/create:
 *  post:
 *      tags:
 *          - Equipe
 *      description: Créer une équipe
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/equipe'
 *      responses:
 *          201:
 *              description: Créée une équipe unique
 *          404:
 *              description: Erreurs provenant des paramètres
 *          409:
 *              description: L'équipe existe déjà en base de données
 */
equipeRouter.post('/create', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: this token is required').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
        } else {
            //ajouter check TOKEN >= 3
            if (!req.body.equipeName || !req.body.sportId) {
                res.json('Error: missing equipe name or sportId').status(404);
            } else {
                let checkSport = getSport(req.body.sportId);
                if (!checkSport) {
                    res.json('Error: This sport id is unknow in database');
                } else {
                    let newEquipe = await equipeService.createEquipe(req.body.sportId, req.body.equipeName, req.body.logo);
                    if (!newEquipe) {
                        res.json('Error: An error occured during the save').status(500);
                    } else {
                        res.json(newEquipe).status(201);
                    }
                }
            }
        }
    }
});

/**
 * @swagger
 * /equipe/update/{equipeId}:
 *  put:
 *      tags:
 *          - Equipe
 *      description: Modifie une équipe
 *      parameters:
 *          - in: path
 *            name: equipeId
 *            description: id de l'équipe
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/equipe'
 *      responses:
 *          200:
 *              description: Modifie les informations d'une équipe unique
 *          404:
 *              description: Erreurs provenant des paramètres
 */
equipeRouter.put('/update/:equipeId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: The token is incorect').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
        } else {
            //ajouter check TOKEN
            if (!req.body.equipeName || !req.body.logo || !req.body.sportId) {
                res.json('Error: equipeName, logo and sportId are required').status(404);
            } else {
                let checkSportId = getSport(req.body.sportId);
                if (!checkSportId) {
                    res.json('Error: This sportId is unknow in database').status(404);
                } else {
                    let checkEquipeName = await equipeService.getEquipeNameByName(req.body.equipeName, req.body.sportId);
                    if (checkEquipeName) {
                        res.json('Error: Equipe name are already used in database').status(400);
                    } else {
                        await equipeService.updateEquipe(req.params.equipeId, req.body.sportId, req.body.equipeName, req.body.logo);
                        res.json('Equipe updated in database').status(200);
                    }
                }
            }
        }
    }
});

/**
 * @swagger
 * /equipe/delete/{equipeId}:
 *  delete:
 *      tags:
 *          - Equipe
 *      description: Supprime une équipe
 *      parameters:
 *          - in: path
 *            name: equipeId
 *            description: id de l'équipe
 *      responses:
 *          200:
 *              description: Supprime les informations d'une équipe unique
 *          404:
 *              description: Erreurs provenant des paramètres
 */
equipeRouter.delete('/delete/:equipeId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: The token is incorrect').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorrect').status(404);
        } else {
            //ajouter check TOKEN
            await equipeService.deleteEquipe(req.params.equipeId);
            res.json('Equipe deleted').status(200);
        }
    }
})

export default equipeRouter;
