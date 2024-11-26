import { Module } from '@nestjs/common';
import { ImagesGalleryService } from './images-gallery.service';
import { ImagesGalleryController } from './images-gallery.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Image, ImageSchema } from './entities/images.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    AuthModule,
  ],
  providers: [ImagesGalleryService],
  controllers: [ImagesGalleryController]
})
export class ImagesGalleryModule {}
