import { User } from "@/models/User.models";
import type { CreateUserData } from "@/types/user.types";
import { Session } from "@/models/Session.models";
export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}
export async function findUserById(userId: string) {
  return User.findById(userId);
}
export async function createUser(data: CreateUserData) {
  return User.create(data);
}

export async function findUserByEmailWithPassword(email: string) {
  return User.findOne({ email }).select("+password");
}

export async function findAllCustomers() {
  return User.find({
    role: "user",
  })
    .select("fullName email createdAt")
    .sort({
      createdAt: -1,
    });
}

export async function findUserByIdWithPassword(
  userId: string
) {
  return User.findById(userId).select(
    "+password"
  );
}
export async function updateUserPassword(
  userId: string,
  passwordHash: string
) {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        password: passwordHash,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
}
