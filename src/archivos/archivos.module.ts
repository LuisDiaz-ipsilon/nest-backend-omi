import { Module } from '@nestjs/common';
import { ArchivosController } from './archivos.controller';
import { ArchivosService } from './archivos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Archivo, ArchivoSchema } from './entities/archivo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Archivo.name, schema: ArchivoSchema }]),
    AuthModule, // Importar el módulo de autenticación si es necesario
  ],
  controllers: [ArchivosController],
  providers: [ArchivosService]
})
export class ArchivosModule {}
