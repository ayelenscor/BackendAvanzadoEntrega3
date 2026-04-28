import mongoose from 'mongoose';

beforeAll(async () => {
  jest.setTimeout(10000);
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
});
