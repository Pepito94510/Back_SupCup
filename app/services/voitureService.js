import voiture from '../models/voiture.js';

export async function getVoitures() {
    return await voiture.findAll();
}

export async function getVoiture(voitureId) {
    return await voiture.findByPk(voitureId);
}

export async function createVoiture(voitureName) {
    const newVoiture = voiture.build({
        Name: voitureName
    });
    await newVoiture.save();
    return newVoiture;
} 

export async function updateVoiture(voitureId, voitureName) {
    let voitureObject = await getVoiture(voitureId);
    voitureObject.Name = voitureName;
    voitureObject.save();
    return voitureObject;
}

export async function deleteVoiture(voitureId) {
    let voitureObject = await getVoiture(voitureId);
    await voitureObject.destroy();
    return true;
}
