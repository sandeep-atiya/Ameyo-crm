/**
 * Swagger/OpenAPI Configuration
 * Central configuration for API documentation
 * Location: docs/swagger/swaggerConfig.js
 */

import swaggerJsdoc from 'swagger-jsdoc';

const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ameyo CRM API',
      version: '1.0.0',
      description: 'REST API for Ameyo Customer Relationship Management System',
      contact: {
        name: 'Ameyo CRM Support',
        email: 'support@ameyo.com',
        url: 'https://ameyo.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
        variables: {
          protocol: {
            default: 'http',
            enum: ['http', 'https'],
          },
        },
      },
      {
        url: process.env.APP_URL || 'http://localhost:5000',
        description: 'Production Server',
      },
    ],
    externalDocs: {
      description: 'Find more info about the API',
      url: 'https://github.com/sandeep-atiya/Ameyo-crm',
    },
  },
  apis: [
    './docs/swagger/schemas.js',
    './docs/swagger/endpoints/auth.swagger.js',
    './docs/swagger/endpoints/profile.swagger.js',
  ],
};

const specs = swaggerJsdoc(swaggerConfig);

export default specs;
