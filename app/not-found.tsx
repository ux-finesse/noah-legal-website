import Link from "next/link";

export default function NotFound() {
  return (
    <main className="on-navy flex min-h-screen flex-col items-start justify-center gap-6 bg-navy px-8 text-ivory sm:px-20">
      <p className="eyebrow text-gold">404</p>
      <h1 className="display text-[clamp(44px,6vw,80px)]">This page could not be found.</h1>
      <Link href="/" className="btn bg-gold text-navy">
        Back to home
      </Link>
    </main>
  );
}
