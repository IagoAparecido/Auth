import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import { PoliciesGuard } from './modules/authorization/providers/guards/policies.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Fazedor API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());

  const jwtGuard = app.get<JwtAuthGuard>(JwtAuthGuard);
  const policiesGuard = app.get<PoliciesGuard>(PoliciesGuard);
  app.useGlobalGuards(jwtGuard, policiesGuard);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
