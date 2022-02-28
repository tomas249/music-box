import { post, get } from "./Api";

export function login(key: string, password: string) {
  return post("/auth/login", { key, password });
}

export function changePassword(newPassword: string) {
  return post("/auth/login", { newPassword });
}

export function identify() {
  return get("/auth/identify");
}

export function confirmInvitation(keyId: string, fullName: string) {
  return post("/auth/invitation/confirm", { keyId, fullName });
}
