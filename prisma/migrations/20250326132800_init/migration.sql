-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'USER', 'TEST');

-- CreateEnum
CREATE TYPE "ReadingMode" AS ENUM ('chunk', 'sentence', 'full');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('system', 'custom');

-- CreateEnum
CREATE TYPE "TextLevel" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "SettingsOptions" AS ENUM ('speakerId', 'askAddNewWord');

-- CreateEnum
CREATE TYPE "PointsReason" AS ENUM ('task', 'vocabulary', 'achievement');

-- CreateEnum
CREATE TYPE "AchievementsType" AS ENUM ('GENERAL', 'TEXTS', 'STREAK', 'VOCABULARY', 'LEADERBOARD');

-- CreateEnum
CREATE TYPE "TextType" AS ENUM ('DICTATION', 'SPEECH', 'DIALOG');

-- CreateTable
CREATE TABLE "Users" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hasPremium" BOOLEAN NOT NULL DEFAULT false,
    "role" "Roles" NOT NULL DEFAULT 'USER',
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Tokens" (
    "refreshToken" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "settingsId" SERIAL NOT NULL,
    "optionName" "SettingsOptions" NOT NULL,
    "optionValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("settingsId")
);

-- CreateTable
CREATE TABLE "Achievements" (
    "achievementId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "points" SMALLINT NOT NULL,
    "type" "AchievementsType" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("achievementId")
);

-- CreateTable
CREATE TABLE "UserAchievements" (
    "userAchievementsId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "achievementId" INTEGER NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievements_pkey" PRIMARY KEY ("userAchievementsId")
);

-- CreateTable
CREATE TABLE "Points" (
    "pointsId" SERIAL NOT NULL,
    "points" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("pointsId")
);

-- CreateTable
CREATE TABLE "PointsHistory" (
    "pointHistoryId" SERIAL NOT NULL,
    "point" SMALLINT NOT NULL DEFAULT 0,
    "reason" "PointsReason" NOT NULL,
    "message" TEXT,
    "textId" INTEGER,
    "achievementId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "pointsId" INTEGER,

    CONSTRAINT "PointsHistory_pkey" PRIMARY KEY ("pointHistoryId")
);

-- CreateTable
CREATE TABLE "VocabularyGroup" (
    "vocabularyGroupId" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "VocabularyGroup_pkey" PRIMARY KEY ("vocabularyGroupId")
);

-- CreateTable
CREATE TABLE "Vocabulary" (
    "vocabularyId" SERIAL NOT NULL,
    "word" VARCHAR(100) NOT NULL,
    "speaker" TEXT NOT NULL,
    "translation" VARCHAR(100) NOT NULL,
    "transcription" VARCHAR(100) NOT NULL,
    "wordFileId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "relatedId" INTEGER,
    "vocabularyGroupId" INTEGER NOT NULL,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("vocabularyId")
);

-- CreateTable
CREATE TABLE "VocabularyAudioFiles" (
    "vocabularyAudioFileId" SERIAL NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "VocabularyAudioFiles_pkey" PRIMARY KEY ("vocabularyAudioFileId")
);

-- CreateTable
CREATE TABLE "Categories" (
    "categoryId" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "categoryType" "CategoryType" NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(100) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "Texts" (
    "textId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "level" "TextLevel" NOT NULL,
    "type" "TextType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Texts_pkey" PRIMARY KEY ("textId")
);

-- CreateTable
CREATE TABLE "DictationMeta" (
    "dictationMetaId" SERIAL NOT NULL,
    "textId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "wordCount" SMALLINT NOT NULL,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DictationMeta_pkey" PRIMARY KEY ("dictationMetaId")
);

-- CreateTable
CREATE TABLE "AudioFiles" (
    "audioFileId" SERIAL NOT NULL,
    "speakerId" TEXT NOT NULL,
    "readingMode" "ReadingMode" NOT NULL,
    "fileName" TEXT NOT NULL,
    "hashedFileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "textId" TEXT NOT NULL,

    CONSTRAINT "AudioFiles_pkey" PRIMARY KEY ("audioFileId")
);

-- CreateTable
CREATE TABLE "Exercises" (
    "exerciseId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "textId" TEXT NOT NULL,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("exerciseId")
);

-- CreateTable
CREATE TABLE "Performance" (
    "performanceId" SERIAL NOT NULL,
    "wpm" SMALLINT,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "totalWords" SMALLINT,
    "correctWords" SMALLINT,
    "errorsCount" SMALLINT,
    "duration" SMALLINT,
    "score" SMALLINT NOT NULL,
    "wpmPenalty" INTEGER,
    "accuracyPenalty" INTEGER,
    "userInput" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "Performance_pkey" PRIMARY KEY ("performanceId")
);

-- CreateTable
CREATE TABLE "Speakers" (
    "speakerId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "speakerCode" TEXT NOT NULL,

    CONSTRAINT "Speakers_pkey" PRIMARY KEY ("speakerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_refreshToken_key" ON "Tokens"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_userId_key" ON "Tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_name_key" ON "Achievements"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievements_userId_achievementId_key" ON "UserAchievements"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "Points_userId_key" ON "Points"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vocabulary_wordFileId_key" ON "Vocabulary"("wordFileId");

-- CreateIndex
CREATE UNIQUE INDEX "DictationMeta_textId_key" ON "DictationMeta"("textId");

-- CreateIndex
CREATE UNIQUE INDEX "Exercises_userId_textId_key" ON "Exercises"("userId", "textId");

-- CreateIndex
CREATE UNIQUE INDEX "Performance_exerciseId_key" ON "Performance"("exerciseId");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievements" ADD CONSTRAINT "UserAchievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievements" ADD CONSTRAINT "UserAchievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievements"("achievementId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsHistory" ADD CONSTRAINT "PointsHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsHistory" ADD CONSTRAINT "PointsHistory_pointsId_fkey" FOREIGN KEY ("pointsId") REFERENCES "Points"("pointsId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyGroup" ADD CONSTRAINT "VocabularyGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_vocabularyGroupId_fkey" FOREIGN KEY ("vocabularyGroupId") REFERENCES "VocabularyGroup"("vocabularyGroupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_wordFileId_fkey" FOREIGN KEY ("wordFileId") REFERENCES "VocabularyAudioFiles"("vocabularyAudioFileId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Texts" ADD CONSTRAINT "Texts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DictationMeta" ADD CONSTRAINT "DictationMeta_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Texts"("textId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioFiles" ADD CONSTRAINT "AudioFiles_textId_fkey" FOREIGN KEY ("textId") REFERENCES "DictationMeta"("textId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Texts"("textId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Performance" ADD CONSTRAINT "Performance_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises"("exerciseId") ON DELETE RESTRICT ON UPDATE CASCADE;
