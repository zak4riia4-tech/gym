import { redirect } from "next/navigation";
import { getAdminServerClient } from "@/lib/supabase/server";

/**
 * The server-side gate every admin page runs before rendering anything.
 *
 * Returns the signed-in admin, or sends the visitor away. Row Level Security
 * is still the real boundary — this exists so an unauthorised person gets a
 * clear answer instead of a blank screen.
 */
export async function requireAdmin() {
  const supabase = await getAdminServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/dashboard");

  return { supabase, user };
}
