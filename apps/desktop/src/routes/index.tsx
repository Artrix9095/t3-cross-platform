import { createFileRoute } from "@tanstack/react-router";

import { AuthShowcase } from "~/components/auth-showcase";
import { api } from "~/trpc";

const Home = () => {
  return <AuthShowcase />;
};

export const Route = createFileRoute("/")({
  component: () => <Home />,
});
