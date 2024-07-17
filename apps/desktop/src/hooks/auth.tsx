import { useRouter } from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/plugin-shell";

import { deleteToken, setToken } from "~/stores/auth";
import { api } from "~/trpc";
import { getAPIUrl } from "~/util/api";

type DeepLinkLoginPayload = {
  event: "login";
  url: string;
  session_token: string;
};

export const signIn = () =>
  new Promise(async (res) => {
    const signInUrl = `${getAPIUrl()}/api/auth/signin?redirect=acme://login`;

    await open(signInUrl);

    listen<DeepLinkLoginPayload>("deep-link", (e) => {
      console.log(e.payload);
      if (e.payload.event.includes("login")) {
        const url = new URL(e.payload.url);
        const sessionToken = url.searchParams.get("session_token");
        if (!sessionToken) return;
        setToken(sessionToken);
        res(sessionToken);
      }
    });
  });

export const useUser = () => {
  const { data: session } = api.auth.getSession.useQuery();
  return session?.user ?? null;
};

export const useSignIn = () => {
  const utils = api.useUtils();
  const router = useRouter();

  return async () => {
    console.log(await signIn());
    await utils.invalidate();
    router.navigate({ to: "/" });
  };
};

export const useSignOut = () => {
  const utils = api.useUtils();
  const signOut = api.auth.signOut.useMutation();
  const router = useRouter();

  return async () => {
    const res = await signOut.mutateAsync();
    if (!res.success) return;
    await deleteToken();
    await utils.invalidate();
    router.navigate({ to: "/" });
  };
};
