# External Integrations

Smart Dictate integrates with several external services to provide its functionality. This document describes these integrations, their purpose, and implementation.

## Google Cloud Text-to-Speech

### Purpose
Converts text to natural-sounding speech for dictation exercises and vocabulary pronunciation.

### Implementation Details
- **Module**: `src/modules/system/text-to-speech`
- **Service**: `TextToSpeechService`
- **Configuration**: Uses service account credentials from `service-account.json`

### Features
- Multiple language support (English, Russian)
- Different voice options (male, female)
- Adjustable speaking rate
- Robust retry mechanism with exponential backoff
- Rate limiting to avoid quota exhaustion

### Integration Flow
1. Text content is received for conversion
2. Configuration is set based on speaker selection
3. API request is made to Google Cloud
4. Audio content is received and processed
5. Retry logic handles rate limiting and errors

### Example Usage
```typescript
const textToSpeechService = new TextToSpeechService();
const result = await textToSpeechService.convertTextToMp3(
  'This is sample text for dictation',
  'sample-filename',
  'en-US-Wavenet-D'
);
```

## AWS S3 Storage

### Purpose
Stores and serves audio files generated for texts and vocabulary words.

### Implementation Details
- **Module**: `src/modules/system/storage`
- **Service**: `StorageService`
- **Configuration**: Uses AWS credentials from environment variables

### Features
- Secure file storage
- Presigned URL generation for limited-time access
- Organized file structure
- File metadata management

### Integration Flow
1. Audio files are generated from text
2. Files are uploaded to S3 with appropriate metadata
3. File paths are stored in the database
4. Presigned URLs are generated for client access
5. Files are retrieved or deleted as needed

### Storage Structure
- `/texts/{textId}/` - Directory for text audio files
  - `full.mp3` - Full text recording
  - `chunk_{index}.mp3` - Chunked recordings
  - `sentence_{index}.mp3` - Sentence-by-sentence recordings
- `/vocabulary/{vocabularyId}/` - Directory for vocabulary audio files
  - `word.mp3` - Word pronunciation

## OpenAI (ChatGPT)

### Purpose
Text processing, analysis, and content generation for dictation exercises.

### Implementation Details
- **Module**: `src/modules/system/chat-gtp`
- **Service**: `ChatGtpService`
- **Configuration**: Uses API key from environment variables

### Features
- Text analysis for difficulty assessment
- Error detection and correction suggestions
- Content generation for exercises
- Language translation assistance

### Integration Flow
1. Text is submitted for analysis or generation
2. ChatGPT API request is configured with specific instructions
3. Response is processed and used within the application
4. Results are cached to minimize API calls

### Example Use Cases
- Analyzing text complexity for difficulty level assignment
- Generating vocabulary suggestions based on text content
- Providing language insights and explanations
- Assisting with transcription validation

## Environment Configuration

External service credentials are managed securely through environment variables defined in `.env`:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smart_dictate"

# AWS S3
AWS_REGION=us-east-1
AWS_BUCKET_NAME=smart-dictate-files
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App Configuration
PORT=3000
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=30d
```

## Security Considerations

### API Key Management
- All API keys and secrets are stored in environment variables
- Service account files are excluded from version control
- Access is limited to necessary permissions only

### Rate Limiting and Quotas
- Retry mechanisms with backoff for API rate limits
- Caching to reduce API calls
- Batch processing where applicable

### Error Handling
- Robust error handling for external service failures
- Graceful degradation when services are unavailable
- Comprehensive logging for troubleshooting

## Monitoring and Logging

- API call success/failure monitoring
- Usage statistics tracking
- Cost monitoring for paid services
- Performance metrics collection 