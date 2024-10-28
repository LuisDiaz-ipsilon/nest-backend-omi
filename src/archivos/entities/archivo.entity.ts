// archivo.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../auth/entities/user.entity'; // Asegúrate de ajustar la ruta según tu proyecto

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
export class Archivo extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true, type: String })
  owner: string; //Se almacena el correo del usuario al que pertecene
}

export const ArchivoSchema = SchemaFactory.createForClass(Archivo);
