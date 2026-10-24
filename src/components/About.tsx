import { Layers, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import React from "react";

const valuePillars = [
  {
    icon: ShieldCheck,
    title: "Backend Systems & AWS at Scale",
    description:
      "Designing, building, and operating resilient backend services at Amazon using AWS and internal cloud tooling to solve real customer problems.",
  },
  {
    icon: Layers,
    title: "End-to-End Product Engineering",
    description:
      "Capable of owning the entire stack, from distributed backend APIs in Java and TypeScript to high-performing web and mobile applications.",
  },
  {
    icon: Sparkles,
    title: "Customer-Obsessed Execution",
    description:
      "Focused on shipping production software that delivers measurable business value: cutting latency by ~40%, scaling across 4 countries, and maintaining high availability.",
  },
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-12 md:py-20">
      <div className="container mx-auto">
        <div className="mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="section-eyebrow mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Engineering Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            About Me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Narrative Bio Cell (7 cols) */}
          <div className="lg:col-span-7 bento-card p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                I&apos;m{" "}
                <strong className="font-semibold text-slate-900 dark:text-slate-100">
                  Keerthan Nandigama
                </strong>
                , a{" "}
                <strong className="font-semibold text-slate-900 dark:text-slate-100">
                  Software Development Engineer II (SDE II) at Amazon
                </strong>{" "}
                in Seattle, WA. With 5+ years of industry experience, an{" "}
                <strong className="font-semibold text-slate-900 dark:text-slate-100">
                  M.S. in Computer Engineering from Stony Brook University
                </strong>
                , and a{" "}
                <strong className="font-semibold text-slate-900 dark:text-slate-100">
                  B.Tech in Computer Science from NIT Durgapur
                </strong>
                , I specialize in building reliable software systems that add
                tangible value for customers.
              </p>
              <p>
                At{" "}
                <strong className="font-semibold text-slate-900 dark:text-slate-100">
                  Amazon
                </strong>
                , my work centers on backend systems built with{" "}
                <strong className="font-semibold text-slate-900 dark:text-slate-100">
                  AWS and internal cloud infrastructure
                </strong>
                , taking services from architecture and implementation all the
                way to production deployment and operational monitoring. Earlier
                in my career at{" "}
                <strong className="font-semibold text-slate-900 dark:text-slate-100">
                  CARS24
                </strong>{" "}
                and{" "}
                <strong className="font-semibold text-slate-900 dark:text-slate-100">
                  NeoGrowth
                </strong>
                , I led cross-functional web and mobile initiatives, cutting
                critical workflow latency by ~40% and shipping applications
                across India, UAE, Indonesia, and Thailand.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-500">
              <span>Backend Systems · AWS · Full-Stack</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                Seattle, WA
              </span>
            </div>
          </div>

          {/* 3 Pillars Stack (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {valuePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bento-card bento-card-hover p-5 flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
