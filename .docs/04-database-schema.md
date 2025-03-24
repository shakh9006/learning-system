# Database Schema

Smart Dictate uses PostgreSQL as its database with Prisma ORM for database access. Below is a detailed description of the database schema.

## Core Entities

### Users
```prisma
model Users {
  userId     Int      @id @default(autoincrement())
  username   String
  email      String   @unique
  password   String
  hasPremium Boolean  @default(false)
  role       Roles    @default(USER)
  isBlocked  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  token            Tokens?
  dictation        Dictations[]
  pointsHistory    PointsHistory[]
  point            Points?
  categories       Categories[]
  vocabularyGroup  VocabularyGroup[]
  settings         Settings[]
  userAchievements UserAchievements[]
}
```
- Central entity for user management
- Stores authentication details and user role
- Linked to various user-specific entities

### Tokens
```prisma
model Tokens {
  refreshToken String   @unique
  exp          DateTime
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user   Users @relation(fields: [userId], references: [userId], onDelete: Cascade)
  userId Int   @unique
}
```
- Stores refresh tokens for authentication
- One-to-one relationship with Users

### Settings
```prisma
model Settings {
  settingsId  Int            @id @default(autoincrement())
  optionName  SettingsOptions
  optionValue String
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  user   Users @relation(fields: [userId], references: [userId], onDelete: Cascade)
  userId Int
}
```
- Stores user preferences and settings
- Many-to-one relationship with Users

## Content Entities

### Categories
```prisma
model Categories {
  categoryId   Int         @id @default(autoincrement())
  name         String      @db.VarChar(100)
  categoryType CategoryType
  slug         String      @db.VarChar(100)
  icon         String      @db.VarChar(100)
  isPublic     Boolean     @default(false)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  text   Texts[]
  user   Users @relation(fields: [userId], references: [userId], onDelete: Cascade)
  userId Int
}
```
- Organizes texts into categories
- Can be system or custom categories
- Many-to-one relationship with Users
- One-to-many relationship with Texts

### Texts
```prisma
model Texts {
  textId    Int       @id @default(autoincrement())
  content   String
  wordCount Int       @db.SmallInt
  level     TextLevel
  hash      String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  relatedId Int?

  category   Categories @relation(fields: [categoryId], references: [categoryId], onDelete: Cascade)
  categoryId Int
  audioFile  AudioFiles[]
  dictation  Dictations[]
}
```
- Core content entity for dictation exercises
- Contains text content and metadata
- Many-to-one relationship with Categories
- One-to-many relationship with AudioFiles and Dictations

### AudioFiles
```prisma
model AudioFiles {
  audioFileId    Int        @id @default(autoincrement())
  speakerId      String
  readingMode    ReadingMode
  fileName       String
  hashedFileName String
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  text   Texts @relation(fields: [textId], references: [textId], onDelete: Cascade)
  textId Int
}
```
- Stores metadata for audio files generated from texts
- Many-to-one relationship with Texts

### Speakers
```prisma
model Speakers {
    speakerId   Int    @id @default(autoincrement())
    name        String
    speakerCode String
}
```
- Defines available text-to-speech voices
- Used for audio generation

## Learning Entities

### Dictations
```prisma
model Dictations {
  dictationId Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user           Users @relation(fields: [userId], references: [userId], onDelete: Cascade)
  userId         Int
  text           Texts @relation(fields: [textId], references: [textId], onDelete: Cascade)
  textId         Int
  performance    Performance?

  @@unique([userId, textId])
}
```
- Records user's dictation attempts
- Links users with texts they have practiced
- One-to-one relationship with Performance
- Unique constraint ensures one dictation per user per text

### Performance
```prisma
model Performance {
  performanceId   Int      @id @default(autoincrement())
  wpm             Int      @db.SmallInt
  accuracy        Float
  totalWords      Int      @db.SmallInt
  correctWords    Int      @db.SmallInt
  errorsCount     Int      @db.SmallInt
  duration        Int      @db.SmallInt
  score           Int      @db.SmallInt
  wpmPenalty      Int
  accuracyPenalty Int
  userInput       String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  dictation   Dictations @relation(fields: [dictationId], references: [dictationId], onDelete: Cascade)
  dictationId Int        @unique
}
```
- Stores detailed performance metrics for dictation attempts
- One-to-one relationship with Dictations

## Vocabulary Entities

### VocabularyGroup
```prisma
model VocabularyGroup {
  vocabularyGroupId Int      @id @default(autoincrement())
  name              String   @db.VarChar(255)
  slug              String   @db.VarChar(255)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user   Users @relation(fields: [userId], references: [userId], onDelete: Cascade)
  userId Int

  vocabulary Vocabulary[]
}
```
- Organizes vocabulary words into groups
- Many-to-one relationship with Users
- One-to-many relationship with Vocabulary

### Vocabulary
```prisma
model Vocabulary {
  vocabularyId             Int      @id @default(autoincrement())
  word                     String   @db.VarChar(100)
  speaker                  String
  translation              String   @db.VarChar(100)
  transcription            String   @db.VarChar(100)
  wordFileId               Int?     @unique
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
  relatedId                Int?

  vocabularyGroup   VocabularyGroup @relation(fields: [vocabularyGroupId], references: [vocabularyGroupId], onDelete: Cascade)
  vocabularyGroupId Int

  wordAudioFile        VocabularyAudioFiles? @relation("WordFile", fields: [wordFileId], references: [vocabularyAudioFileId])
}
```
- Stores individual vocabulary words
- Contains translations and transcriptions
- Many-to-one relationship with VocabularyGroup
- One-to-one optional relationship with VocabularyAudioFiles

### VocabularyAudioFiles
```prisma
model VocabularyAudioFiles {
  vocabularyAudioFileId  Int      @id @default(autoincrement())
  path                   String

  wordFile        Vocabulary? @relation("WordFile")
}
```
- Stores paths to audio files for vocabulary words
- One-to-one optional relationship with Vocabulary

## Gamification Entities

### Points
```prisma
model Points {
  pointsId  Int      @id @default(autoincrement())
  points    Int      @db.SmallInt @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   Users @relation(fields: [userId], references: [userId], onDelete: Cascade)
  userId Int   @unique

  pointsHistory PointsHistory[]
}
```
- Tracks total points for each user
- One-to-one relationship with Users
- One-to-many relationship with PointsHistory

### PointsHistory
```prisma
model PointsHistory {
  pointHistoryId  Int          @id @default(autoincrement())
  point           Int          @db.SmallInt @default(0)
  reason          PointsReason
  message         String?
  textId          Int?
  achievementId   Int?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  user            Users        @relation(fields: [userId], references: [userId], onDelete: Cascade)
  userId          Int

  points          Points?      @relation(fields: [pointsId], references: [pointsId], onDelete: Cascade)
  pointsId        Int?
}
```
- Records point transactions
- Many-to-one relationship with Users
- Many-to-one relationship with Points

### Achievements
```prisma
model Achievements {
  achievementId Int              @id @default(autoincrement())
  name          String           @unique
  description   String?
  points        Int              @db.SmallInt
  type          AchievementsType @default(GENERAL)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  userAchievements UserAchievements[]
}
```
- Defines available achievements
- One-to-many relationship with UserAchievements

### UserAchievements
```prisma
model UserAchievements {
  userAchievementsId Int       @id @default(autoincrement())
  userId             Int
  achievementId      Int
  earnedAt           DateTime  @default(now())

  user               Users     @relation(fields: [userId], references: [userId], onDelete: Cascade)
  achievement        Achievements @relation(fields: [achievementId], references: [achievementId], onDelete: Cascade)

  @@unique([userId, achievementId])
}
```
- Records achievements earned by users
- Many-to-one relationship with Users and Achievements
- Unique constraint ensures each achievement is earned once per user

## Enumerations

### Roles
```prisma
enum Roles {
  ADMIN
  USER
  TEST
}
```
- User role types for access control

### ReadingMode
```prisma
enum ReadingMode {
  chunk
  sentence
  full
}
```
- Audio file reading modes

### CategoryType
```prisma
enum CategoryType {
   system
   custom
}
```
- Category types (system-defined or user-created)

### TextLevel
```prisma
enum TextLevel {
    easy
    medium
    hard
}
```
- Difficulty levels for texts

### SettingsOptions
```prisma
enum SettingsOptions {
    speakerId
    askAddNewWord
}
```
- Available user settings options

### PointsReason
```prisma
enum PointsReason {
  task
  vocabulary
  achievement
}
```
- Reasons for point transactions

### AchievementsType
```prisma
enum AchievementsType {
  GENERAL
  TEXTS
  STREAK
  VOCABULARY
  LEADERBOARD
}
```
- Achievement categories

## Key Relationships

1. **User-Centered Relationships**:
   - Users → Tokens (1:1)
   - Users → Points (1:1)
   - Users → Settings (1:N)
   - Users → Categories (1:N)
   - Users → VocabularyGroup (1:N)
   - Users → Dictations (1:N)
   - Users → UserAchievements (1:N)

2. **Content Relationships**:
   - Categories → Texts (1:N)
   - Texts → AudioFiles (1:N)
   - Texts → Dictations (1:N)

3. **Learning Relationships**:
   - Dictations → Performance (1:1)
   - Dictations links Users and Texts

4. **Vocabulary Relationships**:
   - VocabularyGroup → Vocabulary (1:N)
   - Vocabulary → VocabularyAudioFiles (1:1 optional)

5. **Gamification Relationships**:
   - Points → PointsHistory (1:N)
   - Achievements → UserAchievements (1:N) 