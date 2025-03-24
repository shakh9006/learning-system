# Deployment Guide

This guide covers the process of deploying the Smart Dictate application to a production environment.

## Prerequisites

Before deploying, ensure you have the following:

- Node.js (v16+)
- PostgreSQL database
- AWS S3 bucket configured
- Google Cloud project with Text-to-Speech API enabled
- OpenAI API account
- Domain name (optional for production deployment)

## Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd smart-dictate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database"

   # JWT configuration
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=30d

   # Application
   PORT=3000
   NODE_ENV=production

   # AWS S3
   AWS_REGION=your_region
   AWS_BUCKET_NAME=your_bucket_name
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key

   # Google Cloud
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Create service account file:
   - Place your Google Cloud service account key in `service-account.json` at the project root

## Database Setup

1. Run Prisma migrations to set up the database schema:
   ```bash
   npx prisma migrate deploy
   ```

2. Seed the database with initial data:
   ```bash
   npm run seed
   ```

## Building for Production

Build the application for production:
```bash
npm run build
```

The compiled files will be available in the `dist/` directory.

## Deployment Options

### Option 1: Traditional Server Deployment

1. Transfer the following files to your server:
   - `dist/` directory
   - `node_modules/` directory
   - `.env` file
   - `service-account.json`
   - `package.json`
   - `prisma/` directory

2. Start the application:
   ```bash
   npm run start:prod
   ```

3. Set up a process manager (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start npm --name "smart-dictate" -- run start:prod
   pm2 save
   pm2 startup
   ```

### Option 2: Docker Deployment

1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:16-alpine

   WORKDIR /app

   COPY package*.json ./
   COPY prisma ./prisma/
   COPY .env ./
   COPY service-account.json ./
   COPY tsconfig.json ./
   COPY tsconfig.build.json ./
   COPY dist ./dist/

   RUN npm ci --only=production
   RUN npx prisma generate

   EXPOSE 3000

   CMD ["npm", "run", "start:prod"]
   ```

2. Build and run the Docker image:
   ```bash
   docker build -t smart-dictate .
   docker run -p 3000:3000 smart-dictate
   ```

### Option 3: Cloud Platform Deployment

#### Heroku

1. Create a `Procfile`:
   ```
   web: npm run start:prod
   ```

2. Deploy to Heroku:
   ```bash
   heroku create
   heroku addons:create heroku-postgresql:hobby-dev
   heroku config:set NODE_ENV=production
   # Set all other environment variables via Heroku dashboard or CLI
   git push heroku main
   ```

## Setting Up Reverse Proxy (Nginx)

For production deployments, it's recommended to use Nginx as a reverse proxy:

1. Install Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Create a site configuration:
   ```nginx
   # /etc/nginx/sites-available/smart-dictate
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/smart-dictate /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## SSL Configuration

For secure HTTPS connections:

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. Certbot will automatically configure Nginx for HTTPS.

## Health Checks and Monitoring

1. Use the built-in health check endpoint:
   ```
   GET /api/v1/system/health
   ```

2. Set up monitoring with a service like UptimeRobot or New Relic.

## Database Backups

Set up regular database backups:

```bash
# Create a backup script
mkdir -p /path/to/backups
pg_dump -U username -d database_name > /path/to/backups/backup_$(date +%Y%m%d).sql

# Schedule with cron
0 0 * * * /path/to/backup_script.sh
```

## CI/CD Pipeline (Optional)

For automated deployments, set up a CI/CD pipeline using:
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI

Example GitHub Actions workflow:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy
        # Add deployment steps for your platform
```

## Performance Optimization

1. Enable Gzip compression in Nginx:
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   ```

2. Set up caching for static assets:
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
       expires 30d;
       add_header Cache-Control "public, no-transform";
   }
   ```

## Troubleshooting

Common issues and solutions:

1. **Database connection errors**:
   - Verify DATABASE_URL in .env
   - Check firewall settings
   - Ensure PostgreSQL is running

2. **API integration failures**:
   - Verify API keys and secrets
   - Check service status pages
   - Review service quotas and limits

3. **Application crashes**:
   - Check logs: `pm2 logs` or `docker logs`
   - Verify environment variables
   - Ensure sufficient server resources 