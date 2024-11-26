import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


import { AuthModule } from './auth/auth.module';
import { ArchivosModule } from './archivos/archivos.module';
import { ImagesGalleryModule } from './images-gallery/images-gallery.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot( process.env.MONGO_URI ),
    AuthModule,
    ArchivosModule,
    ImagesGalleryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads_galeria'), // Ruta absoluta a la carpeta de imágenes
      serveRoot: '/uploads_galeria', // Prefijo de la URL para acceder a las imágenes
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
