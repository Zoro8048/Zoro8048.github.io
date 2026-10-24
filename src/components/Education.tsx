"use client";

import { GraduationCap, MapPin } from "lucide-react";
import React from "react";

const education = [
  {
    id: 1,
    degree: "Master of Science in Computer Engineering",
    institution: "Stony Brook University (SUNY)",
    location: "New York, USA",
    period: "2023 - 2025",
    description:
      "Graduate coursework and research focused on distributed systems, cloud computing, machine learning, and scalable software architecture.",
    tags: [
      "Distributed Systems",
      "Cloud Computing",
      "Machine Learning & NLP",
      "Advanced Algorithms",
    ],
    logo: "/images/stony-brook.svg",
  },
  {
    id: 2,
    degree: "Bachelor of Technology in Computer Science & Engineering",
    institution: "National Institute of Technology (NIT) Durgapur",
    location: "West Bengal, India",
    period: "2016 - 2020",
    description:
      "Strong foundation in computer science fundamentals, data structures, operating systems, database management, and full-stack software engineering.",
    tags: [
      "Data Structures & Algorithms",
      "Operating Systems",
      "DBMS",
      "Software Engineering",
    ],
    logo: "/images/nit-durgapur.svg",
  },
];

const Education: React.FC = () => {
  return (
    <section id="education" className="py-12 md:py-20">
      <div className="container mx-auto">
        <div className="mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="section-eyebrow mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Education
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bento-card bento-card-hover p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                      <img
                        src={edu.logo}
                        alt={`${edu.institution} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/images/placeholder-logo.svg";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {edu.degree}
                      </h3>
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        {edu.institution}
                      </div>
                      <div className="inline-flex items-center text-xs text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {edu.location}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0">
                    {edu.period}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {edu.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                {edu.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
