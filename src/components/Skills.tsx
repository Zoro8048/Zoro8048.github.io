import { Cloud, Code2, Cpu, Smartphone, Wrench } from "lucide-react";
import React from "react";

interface SkillItem {
  name: string;
  core?: boolean;
}

interface SkillCategory {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Backend, Cloud & Distributed Systems",
    subtitle: "High-availability services & AWS infrastructure",
    icon: Cloud,
    skills: [
      { name: "AWS", core: true },
      { name: "Backend Architecture", core: true },
      { name: "Distributed Systems", core: true },
      { name: "Spring Boot", core: true },
      { name: "Node.js", core: true },
      { name: "PostgreSQL & SQL", core: true },
      { name: "Express.js" },
      { name: "Ruby on Rails" },
      { name: "Django" },
      { name: "Flask" },
      { name: "Firebase" },
    ],
  },
  {
    title: "Languages & Core",
    subtitle: "Type-safe & systems programming",
    icon: Code2,
    skills: [
      { name: "Java", core: true },
      { name: "TypeScript", core: true },
      { name: "JavaScript (ES6+)", core: true },
      { name: "Python", core: true },
      { name: "Swift", core: true },
      { name: "Kotlin", core: true },
      { name: "C++" },
      { name: "C" },
      { name: "HTML5 / CSS3" },
    ],
  },
  {
    title: "Engineering Practices & Operations",
    subtitle: "Shipping & operating software in production",
    icon: Wrench,
    skills: [
      { name: "CI/CD & Deployment Pipelines", core: true },
      { name: "Production Monitoring & Telemetry", core: true },
      { name: "Performance Optimization", core: true },
      { name: "Clean Architecture", core: true },
      { name: "Test-Driven Development (TDD)", core: true },
      { name: "Multi-Geography Systems" },
      { name: "Git & Code Review" },
    ],
  },
  {
    title: "Web & Mobile Platforms",
    subtitle: "End-to-end client & cross-platform engineering",
    icon: Smartphone,
    skills: [
      { name: "React.js", core: true },
      { name: "Next.js", core: true },
      { name: "React Native", core: true },
      { name: "SwiftUI & iOS" },
      { name: "Jetpack Compose & Android" },
      { name: "Flutter" },
      { name: "Tailwind CSS" },
    ],
  },
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-12 md:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="section-eyebrow mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Technical Expertise</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Skills &amp; Tech Stack
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              <span>Primary Production Stack</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"></span>
              <span>Working Proficiency</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="bento-card bento-card-hover p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                        {category.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          skill.core
                            ? "bg-blue-500/10 text-slate-900 dark:text-slate-100 border border-blue-500/30 font-semibold"
                            : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800"
                        }`}
                      >
                        {skill.core && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        )}
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
