# Module Breakdown

## REST API Modules (`src/modules/rest-api/`)

These modules provide external API endpoints for client applications.

### 1. Auth Module (`auth/`)
- **Purpose**: Handles user authentication and session management
- **Key Components**:
  - `auth.controller.ts`: Endpoints for register, login, refresh tokens, logout
  - `auth.service.ts`: Authentication business logic
  - `strategies/`: Passport strategies for authentication
  - `guards/`: JWT and role-based authorization guards
  - `decorators/`: Custom decorators for user context

### 2. Users Module (`users/`)
- **Purpose**: User account management and profile operations
- **Key Components**:
  - User registration, profile updates, and account management
  - User data retrieval and search
  - User permissions and role management

### 3. Texts Module (`texts/`)
- **Purpose**: Text resource management for dictation exercises
- **Key Components**:
  - Text retrieval with filtering options
  - Detailed text data with performance analytics
  - Text categorization and difficulty levels

### 4. Categories Module (`categories/`)
- **Purpose**: Manages text categories for organization
- **Key Components**:
  - System and custom categories
  - Category creation, editing, and removal
  - Category assignment to texts

### 5. Vocabulary Module (`vocabulary/`) & VocabularyGroup Module (`vocabulary-group/`)
- **Purpose**: User vocabulary management and organization
- **Key Components**:
  - Word storage with translations and transcriptions
  - Vocabulary grouping and organization
  - Audio pronunciation attachment
  - Word relationship management

### 6. Submissions Module (`submissions/`)
- **Purpose**: Handles user dictation submissions
- **Key Components**:
  - Submission processing and validation
  - Performance calculation
  - Result storage and retrieval

### 7. Speakers Module (`speakers/`)
- **Purpose**: Manages available text-to-speech speakers
- **Key Components**:
  - Speaker listing and selection
  - Speaker configuration

### 8. Settings Module (`settings/`)
- **Purpose**: User preference management
- **Key Components**:
  - User settings storage and retrieval
  - Default preferences

### 9. System Module (`system/`)
- **Purpose**: System-level operations and maintenance
- **Key Components**:
  - Health checks
  - System status
  - Maintenance operations

## Internal Modules (`src/modules/internal/`)

These modules implement core business logic and are not directly exposed via API.

### 1. Tokens Module (`tokens/`)
- **Purpose**: JWT token generation and validation
- **Key Components**:
  - Token generation
  - Token validation and refresh
  - Token revocation

### 2. Dictations Module (`dictations/`)
- **Purpose**: Core dictation exercise management
- **Key Components**:
  - Dictation session management
  - Text selection and presentation
  - Exercise configuration

### 3. Performance Module (`performance/`)
- **Purpose**: Analyzes and scores user performance
- **Key Components**:
  - Performance metrics calculation (WPM, accuracy)
  - Error identification and categorization
  - Score computation algorithms

### 4. AudioFiles Module (`audio-files/`)
- **Purpose**: Internal audio file management
- **Key Components**:
  - Audio file record keeping
  - Association with texts
  - Audio metadata management

### 5. Points Module (`points/`) & PointHistory Module (`point-history/`)
- **Purpose**: User points and gamification system
- **Key Components**:
  - Points calculation and allocation
  - Points history tracking
  - Reward triggers and thresholds

### 6. Achievements Module (`achievements/`) & UserAchievements Module (`user-achievements/`)
- **Purpose**: Achievement system management
- **Key Components**:
  - Achievement definition and configuration
  - Achievement progress tracking
  - Achievement awarding

### 7. VocabularyAudioFiles Module (`vocabulary-audio-files/`)
- **Purpose**: Audio files management for vocabulary words
- **Key Components**:
  - Vocabulary audio file management
  - Association with vocabulary entries

## System Modules (`src/modules/system/`)

These modules provide infrastructure and utility services.

### 1. Prisma Module (`prisma/`)
- **Purpose**: Database connectivity and management
- **Key Components**:
  - Prisma client initialization
  - Database connection lifecycle management
  - Transaction management

### 2. Text-to-Speech Module (`text-to-speech/`)
- **Purpose**: Integration with Google Cloud Text-to-Speech
- **Key Components**:
  - Text-to-speech API client
  - Audio generation with retry mechanisms
  - Speaker and language configuration

### 3. Storage Module (`storage/`)
- **Purpose**: File storage management (AWS S3)
- **Key Components**:
  - S3 client configuration
  - File upload and download operations
  - Presigned URL generation

### 4. File Generator Module (`file-generator/`)
- **Purpose**: File generation utilities
- **Key Components**:
  - Audio file generation
  - File naming and organization
  - Temporary file management

### 5. ChatGTP Module (`chat-gtp/`)
- **Purpose**: Integration with OpenAI's GPT for text processing
- **Key Components**:
  - API client configuration
  - Text analysis and evaluation
  - Content generation

### 6. Text Processing Module (`text-processing/`)
- **Purpose**: Text analysis and manipulation
- **Key Components**:
  - Text chunking for dictation
  - Difficulty assessment
  - Word counting and analysis

### 7. Audio Processing Module (`audio-processing/`)
- **Purpose**: Audio file processing utilities
- **Key Components**:
  - Audio format conversion
  - Audio metadata extraction
  - Audio segmentation

### 8. Workflow Module (`workflow/`)
- **Purpose**: Orchestrates complex workflows
- **Key Components**:
  - Multi-step process management
  - Error handling and recovery
  - Process state tracking

## Common Directory (`src/common/`)

- **Purpose**: Shared code and utilities
- **Key Components**:
  - Common interfaces and types
  - Shared constants
  - Utility functions

## Pipes Directory (`src/pipes/`)

- **Purpose**: Request validation and transformation
- **Key Component**:
  - `validation.pipe.ts`: Global validation pipe for DTO validation

## Exceptions Directory (`src/exceptions/`)

- **Purpose**: Custom exception handling
- **Key Components**:
  - Custom exception classes
  - Exception filters

## Utils Directory (`src/utils/`)

- **Purpose**: Utility functions
- **Key Components**:
  - File name sanitization
  - Hash generation
  - Other helper functions 