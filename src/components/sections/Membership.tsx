import { MembershipSection } from "@/components/membership/MembershipSection";
import { getServerI18n } from "@/lib/i18n/server";
import { getActivePlans } from "@/lib/content/public-content";

/**
 * Server component. Its only job is to fetch the plans the owner has published
 * and hand them to the interactive part below, which stays a client component
 * because it owns the billing toggle and the booking dialog.
 */
export async function Membership() {
  const { locale } = await getServerI18n();
  const plans = await getActivePlans(locale);
  return <MembershipSection plans={plans} />;
}
