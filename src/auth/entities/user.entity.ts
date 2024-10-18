import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
export class User {

  // First name of the user
  @Prop({ required: true })
  firstName: string;

  // Last name (paternal) of the user
  @Prop({ required: true })
  lastNameP: string;

  // Last name (maternal) of the user
  @Prop({ required: true })
  lastNameM: string;

  // Email must be unique and required, applying a regex for email validation
  @Prop({
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  })
  email: string;

  // School name
  @Prop({ required: true })
  school: string;

  // Educational level (e.g., secundaria, prepa, universidad)
  @Prop({
    required: true,
    enum: ['secundaria', 'bachillerato', 'ingenieria', 'primaria']
  })
  schoolLevel: string;

  // School year, enforcing numerical values for year (e.g., 1, 2, 3)
  @Prop({ required: true })
  schoolYear: number; // Mejor usar número para el año escolar

  // Bachillerato type (in case of high school students)
  @Prop({
    required: false, // No obligatorio si no aplica
    enum: ['2', '3']
  })
  bachilleratoType?: string;

  // Birth date of the user
  @Prop({ required: true, type: Date })
  birthDate: Date;

  // External system user identifier (omega)
  @Prop({ required: true })
  omegaUser: string;

  @Prop({ minlength: 7, required: true })
  pass?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];
}


export const UserSchema = SchemaFactory.createForClass( User );
