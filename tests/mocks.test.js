import request from 'supertest';
import express from 'express';
import mocksRouter from '../src/routes/mocksRouter.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/api/mocks', mocksRouter);

describe('Mocks Router', () => {
  beforeAll(async () => {
    const uri = 'mongodb://127.0.0.1:27017/entrega-final-test';
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/mocks/generateData', () => {
    test('debería generar e insertar usuarios correctamente', async () => {
      const res = await request(app)
        .post('/api/mocks/generateData')
        .send({ users: 5, pets: 3 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.usersGenerated).toBe(5);
      expect(res.body.petsGenerated).toBe(3);
    });

    test('debería rechazar parámetros negativos', async () => {
      const res = await request(app)
        .post('/api/mocks/generateData')
        .send({ users: -1, pets: 5 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('debería permitir insertar solo usuarios', async () => {
      const res = await request(app)
        .post('/api/mocks/generateData')
        .send({ users: 3, pets: 0 });

      expect(res.status).toBe(201);
      expect(res.body.usersGenerated).toBe(3);
      expect(res.body.petsGenerated).toBe(0);
    });

    test('debería permitir insertar solo mascotas', async () => {
      const res = await request(app)
        .post('/api/mocks/generateData')
        .send({ users: 0, pets: 2 });

      expect(res.status).toBe(201);
      expect(res.body.usersGenerated).toBe(0);
      expect(res.body.petsGenerated).toBe(2);
    });
  });

  describe('GET /api/mocks/mockingusers', () => {
    test('debería generar usuarios mockeados por defecto (50)', async () => {
      const res = await request(app).get('/api/mocks/mockingusers');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.quantity).toBe(50);
      expect(Array.isArray(res.body.payload)).toBe(true);
      expect(res.body.payload.length).toBe(50);
    });

    test('debería generar usuarios mockeados con cantidad personalizada', async () => {
      const res = await request(app)
        .get('/api/mocks/mockingusers')
        .query({ quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(10);
      expect(res.body.payload.length).toBe(10);
    });

    test('los usuarios generados deben tener estructura correcta', async () => {
      const res = await request(app)
        .get('/api/mocks/mockingusers')
        .query({ quantity: 1 });

      const user = res.body.payload[0];
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('age');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('role');
      expect(['admin', 'user']).toContain(user.role);
    });
  });

  describe('GET /api/mocks/mockingpets', () => {
    test('debería generar mascotas mockeadas por defecto (10)', async () => {
      const res = await request(app).get('/api/mocks/mockingpets');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.quantity).toBe(10);
      expect(Array.isArray(res.body.payload)).toBe(true);
    });

    test('debería generar mascotas mockeadas con cantidad personalizada', async () => {
      const res = await request(app)
        .get('/api/mocks/mockingpets')
        .query({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(5);
      expect(res.body.payload.length).toBe(5);
    });

    test('las mascotas generadas deben tener estructura correcta', async () => {
      const res = await request(app)
        .get('/api/mocks/mockingpets')
        .query({ quantity: 1 });

      const pet = res.body.payload[0];
      expect(pet).toHaveProperty('name');
      expect(pet).toHaveProperty('type');
      expect(pet).toHaveProperty('age');
      expect(pet).toHaveProperty('breed');
      expect(pet).toHaveProperty('owner');
    });
  });

  describe('GET /api/mocks/users', () => {
    test('debería obtener todos los usuarios de la BD', async () => {
      const res = await request(app).get('/api/mocks/users');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.payload)).toBe(true);
    });
  });

  describe('GET /api/mocks/pets', () => {
    test('debería obtener todas las mascotas de la BD', async () => {
      const res = await request(app).get('/api/mocks/pets');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.payload)).toBe(true);
    });
  });
});
