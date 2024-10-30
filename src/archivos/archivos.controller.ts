// archivos.controller.ts
import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Request,
    Get,
    Param,
    Res,
    HttpStatus,
    NotFoundException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { v4 as uuidv4 } from 'uuid';
  import { AuthGuard } from '../auth/guards/auth.guard';
  import { ArchivosService } from './archivos.service';
  import { User } from '../auth/entities/user.entity';
  import { join } from 'path';
  import { Response } from 'express';
  // Importa directamente el tipo 'File' desde 'multer'
import { File as MulterFile } from 'multer';

  
  @Controller('api/archivos')
  export class ArchivosController {
    constructor(private readonly archivosService: ArchivosService) {}
  
    @UseGuards(AuthGuard)
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads', // Carpeta donde se guardarán los archivos
          filename: (req, file, cb) => {
            // Personalizar el nombre del archivo
            const filename = `${uuidv4()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
      }),
    )
    async uploadFile(
      @UploadedFile() file: MulterFile,
      @Request() req: any,
    ) {
      console.log(req);
      const user = req.user as User;
      console.log('aqui', user.email);
      const archivo = await this.archivosService.create(file, user.email);
      return {
        status: 'Ok',
        message: 'Archivo subido exitosamente',
        archivo,
      };
    }
  
    @UseGuards(AuthGuard)
    @Get('my-files')
    async getMyFiles(@Request() req: any) {
      const user = req.user as User;
      const archivos = await this.archivosService.findAllByOwner(user.email);
      return archivos;
    }
  
    @UseGuards(AuthGuard)
    @Get('download/:id')
    async downloadFile(
      @Param('id') id: string,
      @Res() res: Response,
      @Request() req: any,
    ) {

      try {
        const archivo = await this.archivosService.findOne(id);
  
        if (!archivo) {
          throw new NotFoundException('Archivo no encontrado');
        }
    
        // Verificar que el usuario es el dueño del archivo
        const user = req.user as User;
        console.log(archivo.owner.toString(), 'Verificaion', user.email,);
        if (archivo.owner.toString() !== user.email) {
          return res
            .status(HttpStatus.FORBIDDEN)
            .json({ message: 'No tienes acceso a este archivo' });
        }
    
        const filePath = join(process.cwd(), archivo.path);
        return res.download(filePath, archivo.filename);
      } catch (error) {
        console.error('Error al descargar el archivo:', error);
        res.status(error.status || 500).json({
          message: error.message || 'Error interno del servidor',
        });
      }
    }
  }
  