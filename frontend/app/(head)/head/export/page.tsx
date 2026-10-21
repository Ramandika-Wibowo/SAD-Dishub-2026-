import { redirect } from "next/navigation";

export default function HeadExportRedirect() {
  redirect("/admin/export");
}
