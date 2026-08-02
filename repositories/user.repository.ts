import { User } from "@/models/User.models";
import type { CreateUserData } from "@/types/user.types";
export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function createUser(data: CreateUserData) {
  return User.create(data);
}

export async function findUserByEmailWithPassword(email:string){
  return User.findOne({email}).select('+password')
}