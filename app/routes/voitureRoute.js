import { Router } from "express";
const voitureRouter = Router();
import * as voitureService from '../services/voitureService.js';

voitureRouter.get('/', async (req, res) => {
    let allVoitures = await voitureService.getVoitures();
    res.json(allVoitures).status(200);
});

voitureRouter.get('/:oneVoiture', async (req, res) => {
    let oneVoiture = await voitureService.getVoiture(req.params.oneVoiture);
    if (!oneVoiture) {
        res.json('Error: no voiture found with this Id').status(404);
    } else {
        res.json(oneVoiture).status(200);
    }
})

voitureRouter.post('/create', async (req, res) => {
    if (!req.body.voitureName) {
        res.json('Error: missing parameters').status(404);
    } else {
        let newVoiture = await voitureService.createVoiture(req.body.voitureName);
        if (!newVoiture) {
            res.json('Error: An error occured during the save').json(500);
        } else {
            res.json(newVoiture).status(200);
        }
    }
})

voitureRouter.put('/update/:voitureId', async (req, res) => {
    if (!req.body.voitureName) {
        res.json('Error: the voiture name is required').status(404);
    } else {
        await voitureService.updateVoiture(req.params.voitureId, req.body.voitureName);
        res.json('Voiture updated').status(200);
    }
});

voitureRouter.delete('/delete/:voitureId', async (req, res) => {
    await voitureService.deleteVoiture(req.params.voitureId);
    res.json('Voiture deleted').status(200);
});

export default sportRouter;
