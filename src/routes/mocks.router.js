import express from 'express';

import { generateMockPets, generateMockUsers } from '../utils/mockingUtil.js';
import { UserRepository } from '../dao/userRepository.js';
import { PetRepository } from '../dao/petRepository.js';

const userRepository = new UserRepository();
const petRepository = new PetRepository();
// Endpoint para generar e insertar usuarios y mascotas mockeadas en la base de datos
router.post('/generateData', async (req, res) => {
    try {
        const usersQty = parseInt(req.body.users) || 0;
        const petsQty = parseInt(req.body.pets) || 0;
        let insertedUsers = [], insertedPets = [];

        if (usersQty > 0) {
            const users = await generateMockUsers(usersQty);
            // Eliminar _id y pets para evitar conflicto con el modelo
            const usersToInsert = users.map(u => {
                const { _id, pets, ...rest } = u;
                return rest;
            });
            insertedUsers = await userRepository.createMultipleUsers(usersToInsert);
        }
        if (petsQty > 0) {
            const pets = generateMockPets(petsQty);
            insertedPets = await petRepository.createMultiplePets(pets);
        }

        res.status(201).json({
            success: true,
            usersInserted: insertedUsers.length,
            petsInserted: insertedPets.length,
            users: insertedUsers,
            pets: insertedPets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating and inserting mock data',
            error: error.message
        });
    }
});

const router = express.Router();

// Endpoint para generar mascotas mockeadas
router.get('/mockingpets', (req, res) => {
    try {
        const quantity = parseInt(req.query.quantity) || 10;
        const pets = generateMockPets(quantity);
        res.status(200).json({
            success: true,
            quantity: pets.length,
            payload: pets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating mock pets',
            error: error.message
        });
    }
});

// Endpoint para generar usuarios mockeados
router.get('/mockingusers', async (req, res) => {
    try {
        const users = await generateMockUsers(50);
        res.status(200).json({
            success: true,
            quantity: users.length,
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating mock users',
            error: error.message
        });
    }
});

export default router;
