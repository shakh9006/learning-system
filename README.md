# Smart Dictate Documentation

Welcome to the Smart Dictate project documentation. This documentation provides comprehensive information about the Smart Dictate application, its architecture, features, and technical details.

## Documentation Index

1. [Project Overview](01-project-overview.md)
   - Introduction to Smart Dictate
   - Core features
   - Target users and value proposition

2. [Technical Architecture](02-technical-architecture.md)
   - Technology stack
   - Architectural patterns
   - System components
   - Data flow
   - Database schema overview
   - Integration points

3. [Module Breakdown](03-module-breakdown.md)
   - REST API modules
   - Internal modules
   - System modules
   - Common utilities
   - Detailed component descriptions

4. [Database Schema](04-database-schema.md)
   - Entity descriptions
   - Relationships
   - Schema details
   - Enumerations
   - Database design decisions

5. [API Endpoints](05-api-endpoints.md)
   - RESTful API documentation
   - Authentication endpoints
   - User and content management
   - Response formats
   - API validation

6. [External Integrations](06-external-integrations.md)
   - Google Cloud Text-to-Speech
   - AWS S3 Storage
   - OpenAI (ChatGPT)
   - Environment configuration
   - Security considerations

7. [Deployment Guide](07-deployment-guide.md)
   - Prerequisites
   - Environment setup
   - Database setup
   - Deployment options
   - Server configuration
   - Monitoring and maintenance

## Quick Start

To get started with the Smart Dictate application:

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see [Deployment Guide](07-deployment-guide.md))
4. Run database migrations: `npx prisma migrate dev`
5. Start the development server: `npm run start:dev`

The API will be available at http://localhost:3000/api/v1 and Swagger documentation at http://localhost:3000/api/docs.

## Project Structure

```
├── prisma/                  # Database schema and migrations
├── src/                     # Source code
│   ├── common/              # Shared types and utilities
│   ├── exceptions/          # Custom exception handlers
│   ├── modules/             # Application modules
│   │   ├── internal/        # Internal business logic
│   │   ├── rest-api/        # API endpoints
│   │   └── system/          # Infrastructure services
│   ├── pipes/               # Request validation pipes
│   ├── utils/               # Utility functions
│   ├── app.module.ts        # Main application module
│   └── main.ts              # Application entry point
├── .env                     # Environment configuration
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## Development Guidelines

### Coding Standards

- Follow NestJS best practices
- Use TypeScript features appropriately
- Document code with JSDoc comments
- Follow the established module structure

### Testing

Run tests using the following commands:

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Contributing

1. Create a feature branch from `develop`
2. Implement changes with tests
3. Submit a pull request
4. Ensure CI passes

## Support and Contact

For questions and support, please contact the project maintainers. 