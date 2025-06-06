import React from "react";

const skills = [
  { name: "Javascript / Typescript", level: 95 },
  { name: "CI/CD", level: 85 },
  { name: "Swift", level: 85 },
  { name: "Java", level: 85 },
  { name: "AWS", level: 80 },
  { name: "Ruby on Rails", level: 75 },
];

const others = [
  { name: "Cross Platform App Development", level: 95 },
  { name: "Performance optimization", level: 90 },
  { name: "CLEAN Code", level: 90 },
  { name: "TDD", level: 90 },
  { name: "Product focused", level: 95 },
  { name: "Analytics & Monitoring ", level: 95 },
];

const SkillBar: React.FC<{ name: string; level: number }> = ({
  name,
  level,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {name}
        </span>
        <span className="text-gray-500 dark:text-gray-400">{level}%</span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-indigo-400 dark:to-blue-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${level}%` }}
        ></div>
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-bl from-white to-teal-50 dark:from-slate-950 dark:to-slate-900 -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
            Skills & Expertise
          </h2>

          <div className="backdrop-blur-lg bg-white/40 dark:bg-slate-900/40 rounded-2xl shadow-glass p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Technical Skills
                </h3>
                {skills.map((skill) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                  />
                ))}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Other Skills
                </h3>
                {others.map((skill) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
