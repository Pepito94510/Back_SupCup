import { Router } from "express";
const sportRouter = Router();
import * as sportService from '../services/sportService.js';
import { checkToken } from "../utils/tokens.js";

sportRouter.get('/', async (req, res) => {
    if(!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let allSports = await sportService.getSports();
        res.json(allSports).status(200);
    }
}); 

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
                let newSport = await sportService.createSport(req.body.sportName);
                if(!newSport) {
                    res.json('Error: An error occured during the save').json(500);
                } else {
                    res.json(newSport).status(200);
                }
            }
        }
    }
})

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
                await sportService.updateSport(req.params.sportId, req.body.sportName);
                res.json('Sport updated').status(200);
            }
        }
    }
});

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
