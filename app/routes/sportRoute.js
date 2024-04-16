import { Router } from "express";
const sportRouter = Router();
import * as sportService from '../services/sportService.js';
import { checkToken } from "../utils/tokens.js";

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

sportRouter.get('/', async (req, res) => {
    if(!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let allSports = await sportService.getSports();
        res.json(allSports).status(200);
    }
});

/**
 * @swagger
 * /sports/find-one/{sportId}:
 *  get:
 *      tags:
 *          - Sport
 *      description: Retourne les informations d'un sport en fonction de son id
 *      parameters:
 *          - in: path
 *            name: sportId
 *            description: id du sport
 *          - in: headers
 *            name: token
 *            description: token d'accès
 *      responses:
 *          200:
 *              description: Retourne les informations d'un sport
 *          404:
 *              description: L'id sport saisie n'est pas connu ne base de données
 */
sportRouter.get('/find-one/:sportId', async (req,res) => {
    if(!req.headers.token) {
        res.json('Error: this token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let oneSport = await sportService.getSport(req.params.sportId);
        if(!oneSport) {
            res.json('Error: no sport found with this Id').status(404);
        } else {
            res.json(oneSport).status(200);
        }
    }
})

/**
 * @swagger
 * /sport/create:
 *  post:
 *      tags:
 *          - Sport
 *      description: Créer un sport unique
 *      parameters:
 *          - in: headers
 *            name: token
 *            description: token d'accès
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
sportRouter.post('/create', async (req,res) => {
    if(!req.headers.token) {
        res.json('Error: this token is required').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
        } else {
        //ajouter check TOKEN >= 3
            if(!req.body.sportName) {
                res.json('Error: missing parameters').status(404);
            } else {
                let newSport = await sportService.createSport(req.body.sportName, req.body.sportImage);
                if(!newSport) {
                    res.json('Error: An error occured during the save').json(500);
                } else {
                    res.json(newSport).status(200);
                }
            }
        }
    }
})

/**
 * @swagger
 * /sport/update/{sportId}:
 *  put:
 *      tags:
 *          - Sport
 *      description: Modifie un sport
 *      parameters:
 *          - in: path
 *            name: sportId
 *            description: id du sport
 *          - in: headers
 *            name: token
 *            description: token d'accès
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
sportRouter.put('/update/:sportId', async (req,res) => {
    if (!req.headers.token) {
        res.json('Error: The token is incorect').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
        } else {
            //ajouter check TOKEN
            if(!req.body.sportName) {
                res.json('Error: the sport name is required').status(404);
            } else {
                await sportService.updateSport(req.params.sportId, req.body.sportName, req.body.sportImage);
                res.json('Sport updated').status(200);
            }
        }
    }
});

/**
 * @swagger
 * /sport/delete/{sportId}:
 *  delete:
 *      tags:
 *          - Sport
 *      description: Supprime un sport par son id
 *      parameters:
 *          - in: path
 *            name: sportId
 *            description: id du sport
 *          - in: headers
 *            name: token
 *            description: token d'accès
 *      responses:
 *          201:
 *              description: Supprime un sport
 *          404:
 *              description: Erreurs provenant des paramètres
 */
sportRouter.delete('/delete/:sportId', async (req,res) => {
    if(!req.headers.token) {
        res.json('Error: The token is incorrect').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if(!tokenOk) {
            res.json('Error: The token is incorrect').status(404);
        } else {
            //ajouter check TOKEN
            await sportService.deleteSport(req.params.sportId);
            res.json('Sport deleted').status(200);
        }
    }
});

/**
 * @swagger
 * /sports/top-sports:
 *  get:
 *      tags:
 *          - Sport
 *      description: Retourne les tops sports du moment
 *      responses:
 *          200:
 *              description: Retourne les informations d'un sport
 */
sportRouter.get('/top-sports', async (req, res) => {
    const limit = 8;
    const order = [['id', 'DESC']];
    let topSports = await sportService.getTopSports(limit, order);
    if(!topSports) {
        res.json("We don't have any sport in database").status(200);
    } else {
        res.json(topSports).status(200);
    }
});

export default sportRouter;
