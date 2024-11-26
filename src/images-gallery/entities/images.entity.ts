// src/images-gallery/entities/image.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Image {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true, type: String })
  uploadedBy: string; // Correo del administrador que subió la imagen

  @Prop({ required: false })
  title?: string;

  @Prop({ required: false })
  description?: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
