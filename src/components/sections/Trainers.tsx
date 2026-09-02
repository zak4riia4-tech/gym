import { TrainersSection } from "@/components/trainers/TrainersSection";
import { getActiveTrainers } from "@/lib/content/public-content";

/** Server component — fetches the published trainers, renders the client part. */
export async function Trainers() {
  const trainers = await getActiveTrainers();
  return <TrainersSection trainers={trainers} />;
}
