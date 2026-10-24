"use client";

import { Briefcase, MapPin } from "lucide-react";
import React, { useState } from "react";

type ExperienceCategory = "full-time" | "internship-mentorship";

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  tenure: string;
  typeLabel: string;
  category: ExperienceCategory;
  current?: boolean;
  summary: string;
  achievements: string[];
  tech: string[];
  logo: string;
  location: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 0,
    role: "Software Development Engineer II (SDE II)",
    company: "Amazon",
    period: "Jun 2025 - Present",
    tenure: "1 yr 5 mos",
    typeLabel: "Full-Time",
    category: "full-time",
    current: true,
    summary:
      "Architecting, building, and operating backend distributed systems on AWS that deliver direct value to customers in production.",
    achievements: [
      "Design, develop, and ship resilient backend services to production using AWS cloud infrastructure and Amazon internal engineering tools.",
      "Own the end-to-end service lifecycle from technical design and API architecture to automated CI/CD pipelines, telemetry, and operational excellence.",
      "Collaborate across teams to turn complex customer requirements into reliable, low-latency backend workflows at scale.",
    ],
    tech: [
      "AWS",
      "Backend Systems",
      "Distributed Services",
      "Java",
      "TypeScript",
      "CI/CD & Internal Tooling",
    ],
    logo: "https://i.postimg.cc/fRTkHZx2/01cada77a0a7d326d85b7969fe26a728.jpg",
    location: "Seattle, WA",
  },
  {
    id: 1,
    role: "Software Engineer",
    company: "CARS24",
    period: "Oct 2021 - Aug 2023",
    tenure: "1 yr 11 mos",
    typeLabel: "Full-Time",
    category: "full-time",
    summary:
      "Drove high-impact mobile and web engineering across 4 international markets, earning 3 company-wide engineering awards.",
    achievements: [
      "Engineered a ~40% performance improvement on a business-critical workflow screen, earning the 'Innovator of the Month' award (Jan 2023).",
      "Architected and launched a unified multi-geography internal application across 4 countries (India, UAE, Indonesia, and Thailand), winning 'Best Coder of the Month' (Sep 2022).",
      "Recognized as 'Rookie of the Quarter - Tech' for rapid ramp-up and immediate impact on core transaction flows.",
    ],
    tech: [
      "React Native",
      "TypeScript",
      "React.js",
      "Performance Optimization",
      "Multi-Tenant Architecture",
    ],
    logo: "https://fastly-production.24c.in/cars24/seo/static/1_20230830_1693395013.png",
    location: "Bangalore, India",
  },
  {
    id: 2,
    role: "Software Development Engineer I",
    company: "NeoGrowth Credit Pvt. Ltd.",
    period: "Nov 2020 - Oct 2021",
    tenure: "1 yr",
    typeLabel: "Full-Time",
    category: "full-time",
    summary:
      "Owned frontend architecture, deployment, and maintenance of the flagship DiGibizz FinTech merchant platform.",
    achievements: [
      "Spearheaded end-to-end frontend development, CI/CD deployment, and production reliability for the 'DiGibizz' product.",
      "Awarded 'Employee of the Month' (Mar 2021), becoming the youngest engineer in company history to receive the honor.",
    ],
    tech: ["React.js", "JavaScript", "TypeScript", "Spring Boot", "CI/CD", "FinTech"],
    logo: "https://neogrowth.in/images/logo/logo_new.svg",
    location: "Bangalore, India",
  },
  {
    id: 3,
    role: "Software Engineer Intern",
    company: "Trial and Error, Inc",
    period: "Jun 2024 - Aug 2024",
    tenure: "3 mos",
    typeLabel: "Summer Internship",
    category: "internship-mentorship",
    summary:
      "Shipped full-stack product features across a fast-moving startup stack during Master's studies at Stony Brook.",
    achievements: [],
    tech: ["TypeScript", "Next.js", "React", "Python"],
    logo: "https://i.postimg.cc/KzFNL09w/image.jpg",
    location: "Remote, USA",
  },
  {
    id: 4,
    role: "Software Engineering Mentor",
    company: "The Newton School",
    period: "Jan 2022 - Feb 2022",
    tenure: "2 mos",
    typeLabel: "Mentorship",
    category: "internship-mentorship",
    summary:
      "Mentored engineers on production-quality code, data structures, and practical problem solving.",
    achievements: [],
    tech: ["JavaScript", "React", "Data Structures", "Clean Code"],
    logo: "https://images.squarespace-cdn.com/content/v1/61f9c6e4cf3bdf202e1ee7d7/5945356e-184a-43a2-b077-cf80d3ddd8f9/newtonschoollogo.jpg",
    location: "Remote, India",
  },
  {
    id: 5,
    role: "React Native Developer Intern",
    company: "Apnicart",
    period: "Jun 2020 - Oct 2020",
    tenure: "5 mos",
    typeLabel: "Internship",
    category: "internship-mentorship",
    summary:
      "Built and shipped cross-platform React Native features in a production e-commerce mobile app.",
    achievements: [],
    tech: ["React Native", "JavaScript", "iOS", "Android"],
    logo: "/images/placeholder-logo.svg",
    location: "Remote, India",
  },
  {
    id: 6,
    role: "React Native Developer Intern",
    company: "Bolndwaves",
    period: "May 2020 - Jun 2020",
    tenure: "2 mos",
    typeLabel: "Internship",
    category: "internship-mentorship",
    summary:
      "Delivered responsive React Native UI screens and state management in a high-tempo sprint.",
    achievements: [],
    tech: ["React Native", "Mobile UI", "JavaScript"],
    logo: "/images/placeholder-logo.svg",
    location: "Remote, India",
  },
  {
    id: 7,
    role: "Android Developer Intern",
    company: "The Sparks Foundation",
    period: "May 2019 - Jun 2019",
    tenure: "2 mos",
    typeLabel: "Internship",
    category: "internship-mentorship",
    summary:
      "Built native Android features and delivered a complete mobile application project.",
    achievements: [],
    tech: ["Android", "Java", "Mobile Development"],
    logo: "https://www.thesparksfoundationsingapore.org/images/logo_small.png",
    location: "Remote, India",
  },
];

const Experience: React.FC = () => {
  const [filter, setFilter] = useState<"all" | ExperienceCategory>("full-time");

  const fullTimeRoles = experiences.filter((e) => e.category === "full-time");
  const earlyCareerRoles = experiences.filter(
    (e) => e.category === "internship-mentorship"
  );

  return (
    <section id="experience" className="py-12 md:py-20">
      <div className="container mx-auto">
        {/* Section Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="section-eyebrow mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career Track Record</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Work Experience
            </h2>
          </div>

          {/* Filter Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/70 dark:bg-[#121620] border border-slate-300/60 dark:border-slate-800 self-start text-xs font-medium">
            <button
              onClick={() => setFilter("full-time")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filter === "full-time"
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Full-Time ({fullTimeRoles.length})
            </button>
            <button
              onClick={() => setFilter("internship-mentorship")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filter === "internship-mentorship"
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Internships &amp; Mentorship ({earlyCareerRoles.length})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              All ({experiences.length})
            </button>
          </div>
        </div>

        {/* Full-Time Split-Rail Ledger (Always rendered in DOM for SEO crawlers) */}
        <div
          className={
            filter === "all" || filter === "full-time"
              ? "space-y-4 mb-8"
              : "hidden"
          }
        >
          {fullTimeRoles.map((exp) => (
            <div
              key={exp.id}
              className={`bento-card p-6 sm:p-8 ${
                exp.current
                  ? "border-blue-500/50 dark:border-blue-400/40"
                  : "bento-card-hover"
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Metadata Rail (4 cols) */}
                <div className="lg:col-span-4 flex flex-col justify-between lg:border-r border-slate-200/80 dark:border-slate-800/80 lg:pr-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          exp.current
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-semibold"
                            : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {exp.current ? "Current Role · Full-Time" : exp.typeLabel}
                      </span>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {exp.tenure}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white p-1.5 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                        <img
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/images/placeholder-logo.svg";
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {exp.company}
                        </div>
                        <div className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" />
                          {exp.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {exp.period}
                  </div>
                </div>

                {/* Right Engineering Impact Content (8 cols) */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                      {exp.role}
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                      {exp.summary}
                    </p>

                    {exp.achievements.length > 0 && (
                      <ul className="space-y-2.5 mb-5">
                        {exp.achievements.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                    {exp.tech.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Bento Grid for Internships & Mentorship (Always rendered in DOM for SEO crawlers) */}
        <div
          className={
            filter === "all" || filter === "internship-mentorship"
              ? "block"
              : "hidden"
          }
        >
          {filter === "all" && (
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
              Early Career, Internships &amp; Mentorship
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earlyCareerRoles.map((exp) => (
              <div
                key={exp.id}
                className="bento-card bento-card-hover p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-3">
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      {exp.typeLabel}
                    </span>
                    <span className="font-mono">{exp.period}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white p-1.5 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/images/placeholder-logo.svg";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-tight">
                        {exp.role}
                      </h4>
                      <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {exp.company} · {exp.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {exp.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/70 flex flex-wrap gap-1.5">
                  {exp.tech.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
