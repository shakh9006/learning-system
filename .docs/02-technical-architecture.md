# Technical Architecture

## Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Documentation**: Swagger
- **Authentication**: JWT (JSON Web Tokens)

### External Services
- **Text-to-Speech**: Google Cloud Text-to-Speech API
- **File Storage**: AWS S3
- **AI Text Processing**: OpenAI (ChatGPT)

## Architectural Patterns

The application follows a modular architecture pattern with clear separation of concerns:

### Module Structure
- **REST API Modules** (`/src/modules/rest-api/`): User-facing API endpoints
- **Internal Modules** (`/src/modules/internal/`): Core business logic
- **System Modules** (`/src/modules/system/`): Infrastructure and utilities

### Layered Architecture
Each module typically follows a layered architecture:
- **Controller**: Handles HTTP requests and responses
- **Service**: Contains business logic
- **Repository**: Handles data access operations
- **DTO**: Data Transfer Objects for request/response validation

## Data Flow

1. **API Request Flow**:
   - Client sends HTTP request
   - NestJS routes to appropriate controller
   - Controller validates input using DTOs
   - Service processes the request with business logic
   - Repository interacts with the database
   - Response is formed and returned to client

2. **Authentication Flow**:
   - User submits credentials
   - Auth service validates credentials
   - JWT tokens (access and refresh) are generated
   - Refresh token stored in cookies
   - Access token used for API access

3. **Dictation Process Flow**:
   - Text is selected or created
   - Text is processed for dictation
   - Audio files are generated using Text-to-Speech
   - Files are stored in S3
   - User accesses dictation exercise
   - User submission is processed and scored
   - Performance metrics are calculated and stored

## System Components

### Core Components

1. **Authentication System**
   - JWT-based authentication
   - Role-based access control
   - Refresh token rotation

2. **Text Processing System**
   - Text analysis for difficulty assessment
   - Text chunking for audio generation
   - Performance evaluation algorithms

3. **Audio Processing System**
   - Integration with Google Cloud Text-to-Speech
   - Audio file generation and management
   - Support for multiple speakers and languages

4. **Storage System**
   - S3 integration for audio file storage
   - Presigned URL generation for secure access
   - File naming and organization

5. **Gamification System**
   - Points calculation and tracking
   - Achievement management
   - User progress analytics

6. **User Management System**
   - User registration and profile management
   - Settings and preferences
   - Role management

## Database Schema

The database schema is defined using Prisma and includes the following main entities:

- **Users**: User accounts and authentication
- **Tokens**: Refresh tokens for authentication
- **Texts**: Content for dictation exercises
- **AudioFiles**: Generated audio files for texts
- **Dictations**: User's dictation attempts
- **Performance**: Metrics for dictation attempts
- **Vocabulary/VocabularyGroup**: User vocabulary collections
- **Categories**: Organization of texts
- **Points/PointsHistory**: User points and history
- **Achievements/UserAchievements**: Available and earned achievements
- **Settings**: User preferences

## Integration Points

- **Google Cloud API**: Text-to-speech conversion
- **AWS S3**: File storage and retrieval
- **OpenAI API**: Text processing and analysis 