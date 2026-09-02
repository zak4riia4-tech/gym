import { MembershipSection } from "@/components/membership/MembershipSection";
import { getActivePlans } from "@/lib/content/public-content";

/**
 * Server component. Its only job is to fetch the plans the owner has published
 * and hand them to the interactive part below, which stays a client component
 * because it owns the billing toggle and the booking dialog.
 */
export async function Membership() {
  const plans = await getActivePlans();
  return <MembershipSection plans={plans} />;
}
