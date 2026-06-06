import { createRootRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/DashBoardLayout/DashBoardLayout";

export const Route = createRootRoute({
  component: DashboardLayout,
});
