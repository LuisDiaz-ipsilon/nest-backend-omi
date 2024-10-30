import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { RegisterUserDto, CreateUserDto, UpdateAuthDto, LoginDto } from './dto';

import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name ) 
    private userModel: Model<User>,

    private jwtService: JwtService,
   ) {}

  
  async create(createUserDto: CreateUserDto): Promise<any> {
    
    try {
      
      const { pass, ...userData } = createUserDto;
           
      const newUser = new this.userModel({
        pass: bcryptjs.hashSync(pass, 10),
        ...userData,
      });

       await newUser.save();
       const { pass: _, ...user } = newUser.toJSON();
       
       return {
        status: 'Ok',
        message: 'Usuario creado',
        userName: user.firstName,
        ok: true
       };
      
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.firstName } ya existe!`)
      }
      throw new InternalServerErrorException('Notifique el error al administrador del sitio');
    }

  }

  async login( loginDto: LoginDto ):Promise<LoginResponse> {

    const { email, pass } = loginDto;

    const user = await this.userModel.findOne({ email });
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - id');
    }
    
    if (!bcryptjs.compareSync(pass, user.pass)) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { pass: _, ...rest } = user.toJSON();

      
    return {
      status: 'Ok',
      message: 'Usuario logeado',
      userName: user.firstName,
      ok: true,
      token: this.getJwtToken({ email: user.email }),
      schoolLevel: user.schoolLevel,
      roles: user.roles
    };
  
  }


  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string ) {
    const user = await this.userModel.findById( id );
    const { pass, ...rest } = user.toJSON();
    return rest;
  }


  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload ) {
    console.log('paYLOAD:'+payload);
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      user.id = user._id; // Asegúrate de que el campo 'id' se mapea correctamente
    }
    return user;
  }

}
