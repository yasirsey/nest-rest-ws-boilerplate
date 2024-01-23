import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest REST API Boilerplate')
    .setDescription('The Nest REST API Boilerplate.')
    .setVersion('1.0.0')
    .addBearerAuth(
      { 
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      'access-token',
    )
    .addTag('users')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(configService.get('PORT'));
}
bootstrap();
