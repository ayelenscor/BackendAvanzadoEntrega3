import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Avanzado - Entrega 2',
      version: '1.0.0',
      description: 'API Backend con autenticación, carrito de compras y generación de datos mockeados',
      contact: {
        name: 'Coderhouse',
        email: 'soporte@coderhouse.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.production.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            first_name: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            age: {
              type: 'integer',
              description: 'Edad del usuario'
            },
            password: {
              type: 'string',
              description: 'Contraseña encriptada'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Rol del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Pet: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único de la mascota'
            },
            name: {
              type: 'string',
              description: 'Nombre de la mascota'
            },
            type: {
              type: 'string',
              description: 'Tipo de mascota'
            },
            age: {
              type: 'integer',
              description: 'Edad de la mascota'
            },
            breed: {
              type: 'string',
              description: 'Raza de la mascota'
            },
            owner: {
              type: 'string',
              description: 'Dueño de la mascota'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        MockUsers: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            quantity: {
              type: 'integer'
            },
            payload: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        MockPets: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            quantity: {
              type: 'integer'
            },
            payload: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Pet'
              }
            }
          }
        },
        GenerateDataResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            usersGenerated: {
              type: 'integer'
            },
            petsGenerated: {
              type: 'integer'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

export default swaggerJsdoc(options);
