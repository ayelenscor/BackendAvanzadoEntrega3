import express from 'express';
import { generateMockUsers, generateMockPets } from '../utils/mockingUtil.js';
import { UserRepository } from '../dao/userRepository.js';
import { PetRepository } from '../dao/petRepository.js';

const router = express.Router();
const userRepository = new UserRepository();
const petRepository = new PetRepository();

/**
 * @swagger
 * /api/mocks/generateData:
 *   post:
 *     summary: Generar e insertar datos mockeados en la BD
 *     tags:
 *       - Mocks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: integer
 *                 example: 50
 *               pets:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Datos generados e insertados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateDataResponse'
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error al generar e insertar datos
 */
router.post('/generateData', async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;

        if (users < 0 || pets < 0) {
            return res.status(400).json({
                success: false,
                message: 'Los parámetros users y pets deben ser mayores o iguales a 0',
            });
        }

        const response = {
            success: true,
            message: 'Datos generados e insertados correctamente',
            usersGenerated: 0,
            petsGenerated: 0,
        };

        if (users > 0) {
            const generatedUsers = await generateMockUsers(users);
            const insertedUsers = await userRepository.createMultipleUsers(generatedUsers);
            response.usersGenerated = insertedUsers.length;
        }

        if (pets > 0) {
            const generatedPets = generateMockPets(pets);
            const insertedPets = await petRepository.createMultiplePets(generatedPets);
            response.petsGenerated = insertedPets.length;
        }

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al generar e insertar datos',
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/mocks/mockingusers:
 *   get:
 *     summary: Generar usuarios mockeados sin insertar en BD
 *     tags:
 *       - Mocks
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Cantidad de usuarios a generar
 *     responses:
 *       200:
 *         description: Usuarios mockeados generados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MockUsers'
 *       500:
 *         description: Error al generar usuarios
 */
router.get('/mockingusers', async (req, res) => {
    try {
        const quantity = parseInt(req.query.quantity) || 50;
        const users = await generateMockUsers(quantity);
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

/**
 * @swagger
 * /api/mocks/mockingpets:
 *   get:
 *     summary: Generar mascotas mockeadas sin insertar en BD
 *     tags:
 *       - Mocks
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de mascotas a generar
 *     responses:
 *       200:
 *         description: Mascotas mockeadas generadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MockPets'
 *       500:
 *         description: Error al generar mascotas
 */
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

/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     summary: Obtener todos los usuarios de la BD
 *     tags:
 *       - Mocks
 *     responses:
 *       200:
 *         description: Usuarios obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 quantity:
 *                   type: integer
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error al obtener usuarios
 */
router.get('/users', async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        res.status(200).json({
            success: true,
            quantity: users.length,
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving users',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/mocks/pets:
 *   get:
 *     summary: Obtener todas las mascotas de la BD
 *     tags:
 *       - Mocks
 *     responses:
 *       200:
 *         description: Mascotas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 quantity:
 *                   type: integer
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Error al obtener mascotas
 */
router.get('/pets', async (req, res) => {
    try {
        const pets = await petRepository.getAllPets();
        res.status(200).json({
            success: true,
            quantity: pets.length,
            payload: pets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving pets',
            error: error.message
        });
    }
});

export default router;
