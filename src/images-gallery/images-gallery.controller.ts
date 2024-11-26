// src/images-gallery/images-gallery.controller.ts
import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Body,
    Req,
    Res,
    HttpStatus,
    ForbiddenException,
  } from '@nestjs/common';
  import { ImagesGalleryService } from './images-gallery.service';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { v4 as uuidv4 } from 'uuid';
  import { CreateImageDto } from './dto/create-image.dto';
  import { AuthGuard } from '../auth/guards/auth.guard'; // Asegúrate de ajustar la ruta
  import { Request, Response } from 'express';
  
  @Controller('api/gallery')
  export class ImagesGalleryController {
    constructor(private readonly imagesGalleryService: ImagesGalleryService) {}
  
    // Obtener todas las imágenes (accesible a todos los usuarios autenticados)
    @Get()
    async getAllImages() {
      const images = await this.imagesGalleryService.findAll();
      return images;
    }
  
    // Subir una nueva imagen (solo administradores)
    @UseGuards(AuthGuard)
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads_galeria', // Carpeta específica para la galería
          filename: (req, file, cb) => {
            const filename = `${uuidv4()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          // Validar que solo se suban imágenes
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Solo se permiten imágenes'), false);
          }
          cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // Limitar el tamaño del archivo a 5MB
      }),
    )
    async uploadImage(
      @UploadedFile() file: Express.Multer.File,
      @Body() createImageDto: CreateImageDto,
      @Req() req: any,
    ) {

        const user = req.user;

        // Verificar si el usuario tiene el rol de admin
        if (user.roles.includes('admin')) {
            const image = await this.imagesGalleryService.create(file, user.email, createImageDto);
            return {
                status: 'Ok',
                message: 'Imagen subida exitosamente',
                image,
              };
        } else {
            // Si no tiene el rol, lanza una excepción con mensaje personalizado
            throw new ForbiddenException('Acceso denegado: solo administradores pueden subir imagenes.');
        }

    }
  
    // Eliminar una imagen (solo administradores)
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteImage(@Param('id') id: string, @Req() req: any) {
      const user = req.user;

      if (user.roles.includes('admin')) {
        await this.imagesGalleryService.delete(id, user.email, user.roles);
        return {
            status: 'Ok',
            message: 'Imagen eliminada exitosamente',
        };
      } else {
            // Si no tiene el rol, lanza una excepción con mensaje personalizado
            throw new ForbiddenException('Acceso denegado: solo administradores pueden eliminar imagenes.');
      }

    }
  
    // Descargar una imagen específica
    @Get('download/:id')
    async downloadImage(
      @Param('id') id: string,
      @Res() res: Response,
    ) {
      try {
        const image = await this.imagesGalleryService.findOne(id);
        const filePath = image.path;
        return res.sendFile(filePath, { root: process.cwd() });
      } catch (error) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Imagen no encontrada',
        });
      }
    }
  }
  