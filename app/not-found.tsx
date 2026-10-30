import Button from "@/components/Button";

export default function NotFound() {
  return (
    <main className="on-navy flex min-h-screen flex-col items-start justify-center gap-6 bg-navy px-8 text-ivory sm:px-20">
      <p className="eyebrow text-gold">404</p>
      <h1 className="display text-[clamp(44px,6vw,80px)]">This page could not be found.</h1>
      <Button variant="gold" href="/">
        Back to home
      </Button>
    </main>
  );
}
