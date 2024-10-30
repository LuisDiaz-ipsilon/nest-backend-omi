// archivos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Archivo } from './entities/archivo.entity';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
// Importa directamente el tipo 'File' desde 'multer'
import { File as MulterFile } from 'multer';





@Injectable()
export class ArchivosService {
  constructor(
    @InjectModel(Archivo.name)
    private archivoModel: Model<Archivo>,
  ) {}

  async create(file: MulterFile, ownerId: string): Promise<Archivo> {
    const newArchivo = new this.archivoModel({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      owner: ownerId,
    });
    return newArchivo.save();
  }

  async findAllByOwner(ownerId: string): Promise<Archivo[]> {
    return this.archivoModel.find({ owner: ownerId }).exec();
  }

  async findAllFiles(): Promise<Archivo[]> {
    return this.archivoModel.find().exec();
  }

  async findOne(id: string): Promise<Archivo> {
    return this.archivoModel.findById(id).exec();
  }
}
