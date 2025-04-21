import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const port = process.env.PORT ?? 5878;
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });

  // Enable CORS
  app.enableCors();

  // Stripe webhook needs raw body
  app.use('/webhook', bodyParser.raw({ type: 'application/json' }));

  // Other routes use JSON parser
  app.use(bodyParser.json());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Wale Grills API')
    .setDescription('The API for Wale Grills')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Only listen once!
  await app.listen(port);
}

bootstrap();
