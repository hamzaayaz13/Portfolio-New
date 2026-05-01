"use client";

export default function PersonalProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-svh bg-neutral-950 px-6 py-16 text-white">
      <h1 className="mb-4 text-xl font-semibold">This project page hit an error</h1>
      <p className="mb-6 max-w-xl text-sm text-white/70">
        Copy the message below if you are debugging. After changing dependencies or seeing a stale chunk error, try{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">rm -rf .next</code> then{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">npm run dev:clean</code>.
      </p>
      <pre className="mb-8 max-h-[40vh] overflow-auto rounded-lg border border-white/15 bg-black/60 p-4 text-xs text-rose-200">
        {error.message}
        {error.digest ? `\n\ndigest: ${error.digest}` : ""}
      </pre>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20"
      >
        Try again
      </button>
    </div>
  );
}
