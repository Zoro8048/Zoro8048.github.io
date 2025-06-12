import { Briefcase, MapPin } from "lucide-react";
import React from "react";

const experiences = [
  {
    id: 0,
    role: "SDE II",
    company: "Amazon",
    period: "Jun. 2025 - Present",
    description: "",
    achievements: [],
    logo: "https://i.postimg.cc/fRTkHZx2/01cada77a0a7d326d85b7969fe26a728.jpg",
    location: "Seattle, USA",
  },
  {
    id: 1,
    role: "Software Engineer Intern",
    company: "Trial and Error, Inc",
    period: "Jun. 2024 - Aug. 2024",
    description: "",
    achievements: [],
    logo: "https://i.postimg.cc/KzFNL09w/image.jpg",
    location: "Remote, USA",
  },
  {
    id: 2,
    role: "Software Engineer",
    company: "CARS24",
    period: "Oct. 2021 - Aug. 2023",
    description: "",
    achievements: [],
    logo: "https://fastly-production.24c.in/cars24/seo/static/1_20230830_1693395013.png",
    location: "Bangalore, India",
  },
  {
    id: 3,
    role: "Software Development Engineer I",
    company: "NeoGrowth Credit Pvt. Ltd.",
    period: "Nov. 2020 - Oct. 2021",
    description: "",
    achievements: [],
    logo: "https://neogrowth.in/images/logo/logo_new.svg",
    location: "Bangalore, India",
  },
  {
    id: 4,
    role: "Mentor",
    company: "The Newton School",
    period: "Jan. 2022 - Feb. 20222",
    description: "",
    achievements: [],
    logo: "https://images.squarespace-cdn.com/content/v1/61f9c6e4cf3bdf202e1ee7d7/5945356e-184a-43a2-b077-cf80d3ddd8f9/newtonschoollogo.jpg",
    location: "Remote, India",
  },
  {
    id: 5,
    role: "React Native Developer Intern",
    company: "Apnicart",
    period: "Jun. 2020 - Jul. 2021",
    description: "",
    achievements: [],
    logo: "https://creditdirect.seamlesshiring.com/img/company.png",
    location: "Remote, India",
  },
  {
    id: 6,
    role: "React Native Developer Intern",
    company: "Bolndwaves",
    period: "May 2020 - Jun. 2020",
    description: "",
    achievements: [],
    logo: "https://creditdirect.seamlesshiring.com/img/company.png",
    location: "Remote, India",
  },
  {
    id: 7,
    role: "Android Developer Intern",
    company: "The Sparks Foundation",
    period: "May 2019 - Jun. 2019",
    description: "",
    achievements: [],
    logo: "https://www.thesparksfoundationsingapore.org/images/logo_small.png",
    location: "Remote, India",
  },
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-12 md:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-bl from-white to-blue-50 dark:from-slate-950 dark:to-slate-900 -z-10"></div>

      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-8 md:mb-12">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 md:p-3 rounded-xl">
              <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold ml-3 md:ml-4 text-gray-800 dark:text-white">
              Professional Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative">
                <div className="backdrop-blur-lg bg-white/30 dark:bg-slate-800/30 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white dark:bg-slate-700 p-2 shadow-md">
                        <img
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder-company.png";
                          }}
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="flex flex-col">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                            {exp.role}
                          </h3>
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                            {exp.company}
                          </p>
                          <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex-grow">
                      {exp.description && (
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                          {exp.description}
                        </p>
                      )}

                      {exp.achievements.length > 0 && (
                        <div className="space-y-2 mt-4">
                          {exp.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-2 mt-1.5"></div>
                              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                                {achievement}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                        {exp.period}
                      </span>
                    </div>
                  </div>
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
