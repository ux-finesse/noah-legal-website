import type { Metadata } from "next";
import Link from "next/link";

import JobsList from "@/components/JobsList";
import NavyHeader from "@/components/NavyHeader";
import { Accent, Picture } from "@/components/ui";
import { getJobs } from "@/lib/content";

export const metadata: Metadata = { title: "Careers" };

const perks = [
  ["Real matters, early", "Junior lawyers sit on live transactions and disputes from the first month."],
  ["Mentorship", "Every associate is paired with a partner who reviews their growth."],
  ["Learning", "[Training, CPD and certification support offered.]"],
  ["Wellbeing", "[Health cover, leave and flexibility benefits.]"],
];

export default async function CareersPage() {
  const jobs = await getJobs();
  return (
    <>
      <NavyHeader>
        <div className="container-site flex flex-wrap items-end gap-x-20 gap-y-10 pt-16 lg:pt-24">
          <div className="min-w-0 flex-[999_1_560px]">
            <p className="eyebrow mb-6 text-gold">Careers</p>
            <h1 className="display text-[clamp(44px,6vw,88px)]">
              Do the best work <Accent>of your career.</Accent>
            </h1>
          </div>
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-7 pb-2">
            <p className="text-lg leading-relaxed text-muted-light">Real responsibility early, partners who teach, and matters that shape industries.</p>
            <a href="#roles" className="btn self-start bg-gold text-navy hover:text-navy">
              See open roles
            </a>
          </div>
        </div>
        <div className="container-site pt-[72px]">
          <Picture alt="Team at work" label="[TEAM PHOTO]" className="h-[260px] border border-dashed border-ivory/20 sm:h-[400px]" dark />
        </div>
        <div className="h-24 bg-[linear-gradient(#16213D_0_50%,#F5F3EF_50%_100%)]" />
      </NavyHeader>
      <main>
        <section className="container-site pb-28 pt-16">
          <p className="eyebrow mb-4 text-gold-ink">Why NOAH</p>
          <h2 className="display mb-14 text-[clamp(40px,5vw,64px)]">
            What you <Accent gold={false}>get here</Accent>
          </h2>
          <div className="flex flex-wrap gap-x-12 border-t border-line">
            {perks.map(([t, d]) => (
              <div key={t} className="flex min-w-0 flex-[1_1_260px] flex-col gap-3 py-8">
                <h3 className="font-serif text-[28px] font-normal">{t}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="roles" className="bg-sand">
          <div className="container-site py-28">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow mb-4 text-gold-ink">Open roles</p>
                <h2 className="display text-[clamp(40px,5vw,64px)]">
                  Join the <Accent gold={false}>team</Accent>
                </h2>
              </div>
              <span className="text-[15px] text-muted">
                {jobs.length} position{jobs.length === 1 ? "" : "s"} open
              </span>
            </div>
            <JobsList jobs={jobs} />
          </div>
        </section>

        <section className="container-site flex flex-wrap items-end gap-x-20 gap-y-10 py-28">
          <div className="min-w-0 flex-[999_1_600px]">
            <h2 className="display mb-4 text-[clamp(36px,4.6vw,60px)] leading-[1.05]">
              Don’t see your role? <span className="italic text-gold-ink">Write to us anyway.</span>
            </h2>
            <p className="text-[17px] leading-relaxed text-muted">Send your CV and a short note to [careers@noahlegal.com].</p>
          </div>
          <Link href="mailto:careers@noahlegal.com" className="btn min-h-[52px] bg-navy px-7 text-ivory hover:text-gold">
            Send your CV
          </Link>
        </section>
      </main>
    </>
  );
}
