import { redirect } from "next/navigation";

export default function HeadDashboardRedirect() {
  redirect("/admin/analytics");
}
