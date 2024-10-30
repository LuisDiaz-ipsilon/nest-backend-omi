import { User } from '../entities/user.entity';



export interface LoginResponse {
  status: String;
  message: String;
  token?: String;
  userName?: String;
  ok: boolean;
  schoolLevel?: string;
  roles: string[];
}