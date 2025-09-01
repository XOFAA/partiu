import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades extras que não estão no DTO
      forbidNonWhitelisted: true, // erro se enviar propriedades desconhecidas
      transform: true, // transforma tipos automaticamente (ex: string -> number)
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Ingressos API')
    .setDescription('API para venda e validação de ingressos')
    .setVersion('1.0')
    .addBearerAuth() // habilita JWT no swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3002);
}
bootstrap();
