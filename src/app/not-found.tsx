import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-shell py-24 text-center">
      <h1 className="display text-5xl">Slice not found</h1>
      <p className="mt-4 text-[var(--ink-soft)]">That page crumbled. Try the cohort menu.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Back home
      </Link>
    </div>
  );
}
