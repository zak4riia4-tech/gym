import { CalendarCheck, CircleCheck, Clock, Inbox } from "lucide-react";
import type { BookingStats } from "@/lib/admin/bookings";

const TILES = [
  { key: "total", label: "Total bookings", icon: Inbox, accent: "text-chalk" },
  { key: "pending", label: "Pending", icon: Clock, accent: "text-ash" },
  { key: "confirmed", label: "Confirmed", icon: CalendarCheck, accent: "text-brass" },
  { key: "completed", label: "Completed", icon: CircleCheck, accent: "text-success" },
] as const;

export function DashboardStats({ stats }: { stats: BookingStats }) {
  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {TILES.map(({ key, label, icon: Icon, accent }) => (
        <div key={key} className="rounded-[2px] border border-steel bg-iron p-5">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              {label}
            </dt>
            <Icon aria-hidden="true" className={`size-4 shrink-0 ${accent}`} />
          </div>
          <dd className={`u-display mt-4 text-[32px] font-extrabold leading-none ${accent}`}>
            {stats[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
