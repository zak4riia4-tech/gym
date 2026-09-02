"use client";

/**
 * Last resort. Only runs if the root layout itself fails, which means the
 * fonts and stylesheet may not have loaded — so this page carries its own
 * inline styling and assumes nothing.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          backgroundColor: "#08090B",
          color: "#F2F0EB",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "34rem" }}>
          <h1 style={{ fontSize: "1.6rem", margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#8B9099", lineHeight: 1.6, marginTop: "1rem" }}>
            The site could not start. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              minHeight: "48px",
              padding: "0 1.5rem",
              border: 0,
              borderRadius: "2px",
              backgroundColor: "#C8873A",
              color: "#08090B",
              fontFamily: "ui-monospace, monospace",
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
