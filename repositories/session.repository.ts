import { Session } from "@/models/Session.models";
import type { CreateSessionData } from "@/types/session.types";

export async function createSession(data: CreateSessionData) {
  return Session.create(data);
}
