"use client";

import { ArrowUpRight, Award, Globe, Rocket, Trophy, Zap } from "lucide-react";
import React from "react";

const achievements = [
  {
    id: 1,
    title: "Innovator of the Month",
    organization: "CARS24",
    date: "Jan 2023",
    metricBadge: "~40% Latency Reduction",
    icon: Zap,
    description:
      "Awarded for profiling, re-architecting, and optimizing a business-critical workflow screen, improving render and interaction performance by ~40% in production.",
    logo: "https://fastly-production.24c.in/cars24/seo/static/1_20230830_1693395013.png",
  },
  {
    id: 2,
    title: "Best Coder of the Month",
    organization: "CARS24",
    date: "Sep 2022",
    metricBadge: "4 Global Markets (IN, UAE, ID & TH)",
    icon: Globe,
    description:
      "Awarded for designing a clean, extensible multi-geography configuration system supporting 4 countries from a single unified codebase while enforcing strict architectural standards.",
    logo: "https://fastly-production.24c.in/cars24/seo/static/1_20230830_1693395013.png",
  },
  {
    id: 3,
    title: "Rookie of the Quarter - Tech",
    organization: "CARS24",
    date: "2021 - 2022",
    metricBadge: "Core Transaction Flows",
    icon: Rocket,
    description:
      "Recognized across the engineering organization for rapid onboarding and immediate high-leverage contributions to core revenue-critical applications.",
    logo: "https://fastly-production.24c.in/cars24/seo/static/1_20230830_1693395013.png",
  },
  {
    id: 4,
    title: "Employee of the Month",
    organization: "NeoGrowth Credit Pvt. Ltd.",
    date: "Mar 2021",
    metricBadge: "Youngest Recipient in Company History",
    icon: Award,
    description:
      "Owned end-to-end frontend development, deployment, and production reliability for the flagship 'DiGibizz' platform, becoming the youngest engineer at the company to win the award.",
    logo: "https://neogrowth.in/images/logo/logo_new.svg",
  },
];

const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="py-12 md:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="section-eyebrow mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>Verified Impact &amp; Awards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Recognition &amp; Highlights
            </h2>
          </div>

          <a
            href="https://docs.google.com/document/d/16IA_B_VPAjWNEaUJ3oq2SvG7gOAkZznUMn6qKbL9O94/edit?tab=t.0"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#121620] hover:border-blue-500/50 text-xs font-semibold text-slate-900 dark:text-slate-100 self-start transition-all"
          >
            <span>Read Full Case Studies Doc</span>
            <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className="bento-card bento-card-hover p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                      <Icon className="w-3.5 h-3.5" />
                      {achievement.metricBadge}
                    </span>
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                      {achievement.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                      <img
                        src={achievement.logo}
                        alt={`${achievement.organization} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/images/placeholder-logo.svg";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {achievement.title}
                      </h3>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {achievement.organization}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
