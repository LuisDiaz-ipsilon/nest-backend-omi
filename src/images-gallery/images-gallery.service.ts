// src/images-gallery/images-gallery.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image, ImageDocument } from './entities/images.entity';

@Injectable()
export class ImagesGalleryService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  // Subir una nueva imagen
  async create(file: Express.Multer.File, uploadedBy: string, createImageDto: CreateImageDto): Promise<Image> {
    const newImage = new this.imageModel({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      uploadedBy,
      ...createImageDto,
    });
    return newImage.save();
  }

  // Obtener todas las imágenes
  async findAll(): Promise<Image[]> {
    return this.imageModel.find().exec();
  }

  // Obtener una imagen por ID
  async findOne(id: string): Promise<Image> {
    const image = await this.imageModel.findById(id).exec();
    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }
    return image;
  }

  // Eliminar una imagen
  async delete(id: string, requesterEmail: string, requesterRoles: string[]): Promise<void> {
    const image = await this.findOne(id);

    // Verificar si el solicitante es administrador
    if (!requesterRoles.includes('admin')) {
      throw new ForbiddenException('No tienes permisos para eliminar esta imagen');
    }

    await this.imageModel.findByIdAndDelete(id).exec();
    // Opcional: eliminar el archivo del sistema de archivos
    // Implementar lógica para eliminar el archivo físicamente si es necesario
  }

  // Actualizar una imagen (opcional)
  async update(id: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const updatedImage = await this.imageModel.findByIdAndUpdate(id, updateImageDto, { new: true }).exec();
    if (!updatedImage) {
      throw new NotFoundException('Imagen no encontrada');
    }
    return updatedImage;
  }
}
