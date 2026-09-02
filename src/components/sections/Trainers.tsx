import { TrainersSection } from "@/components/trainers/TrainersSection";
import { getServerI18n } from "@/lib/i18n/server";
import { getActiveTrainers } from "@/lib/content/public-content";

/** Server component — fetches the published trainers, renders the client part. */
export async function Trainers() {
  const { locale } = await getServerI18n();
  const trainers = await getActiveTrainers(locale);
  return <TrainersSection trainers={trainers} />;
}
