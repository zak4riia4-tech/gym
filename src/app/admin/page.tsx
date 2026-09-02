import { redirect } from "next/navigation";

/** /admin is not a page of its own — send people to the dashboard. */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
