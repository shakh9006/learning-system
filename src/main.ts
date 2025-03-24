import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT;
  const config = new DocumentBuilder()
    .setTitle('Dictate API')
    .setDescription('Smart Dictate API Documentation')
    .setVersion('1.0')
    .build();

  const app = await NestFactory.create(AppModule);

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentFactory);

  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors();
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(PORT);
}

bootstrap();
