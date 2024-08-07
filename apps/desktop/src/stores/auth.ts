import { Store } from "@tauri-apps/plugin-store";

export const authStore = new Store("session");
// Turn these into 1 liners

export const getToken = () => authStore.get<string>("token");

export const setToken = (token: string) => authStore.set("token", token);

export const deleteToken = () => authStore.delete("token");
