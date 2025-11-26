import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ameyo CRM API',
      version: '1.0.0',
      description: 'REST API for Ameyo Customer Relationship Management System',
      contact: {
        name: 'Ameyo CRM Support',
        email: 'support@ameyo.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
      {
        url: process.env.APP_URL || 'http://localhost:5000',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token required for authenticated endpoints',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User unique identifier',
            },
            uname: {
              type: 'string',
              description: 'Username',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              description: 'User password (hashed in database)',
              format: 'password',
            },
            ProPicture: {
              type: 'string',
              description: 'Profile picture URL',
              nullable: true,
            },
            UserTypeId: {
              type: 'integer',
              description: 'Foreign key referencing UserType',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['uname', 'password'],
        },
        LoginRequest: {
          type: 'object',
          properties: {
            uname: {
              type: 'string',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
          required: ['uname', 'password'],
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            uname: {
              type: 'string',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
            ProPicture: {
              type: 'string',
              description: 'Optional profile picture URL',
              nullable: true,
            },
          },
          required: ['uname', 'password'],
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            password: {
              type: 'string',
              format: 'password',
              description: 'New password (optional)',
            },
            ProPicture: {
              type: 'string',
              description: 'New profile picture URL (optional)',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
            },
            token: {
              type: 'string',
              description: 'JWT token (for login/register)',
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;
