/**
 * Shown while an admin page fetches its data on the server.
 * A calm skeleton rather than a spinner, so the layout does not jump.
 */
export default function AdminLoading() {
  return (
    <div className="min-h-dvh bg-void px-5 py-8 lg:px-8 lg:py-10 lg:pl-[17rem]">
      <p className="sr-only" role="status">
        Loading
      </p>

      <div className="h-8 w-52 rounded-[2px] bg-iron" />
      <div className="mt-4 h-4 w-80 max-w-full rounded-[2px] bg-iron" />

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-[2px] border border-steel bg-iron" />
        ))}
      </div>

      <div className="mt-12 h-64 rounded-[2px] border border-steel bg-iron" />
    </div>
  );
}
