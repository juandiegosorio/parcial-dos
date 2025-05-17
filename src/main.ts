import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BusinessErrorsInterceptor } from './shared/interceptors/business-errors/business-errors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });
  
  // Add global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Add global interceptor to handle business errors
  app.useGlobalInterceptors(new BusinessErrorsInterceptor());
  
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch(err => {
  console.error('Error starting the application:', err);
});
