import { User } from "@/models/User.models";

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function createUser(data: {
  fullName: string;
  email: string;
  password: string;
}) {
  return User.create(data);
}
