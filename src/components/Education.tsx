import { GraduationCap, MapPin } from "lucide-react";
import React from "react";

const education = [
  {
    id: 1,
    degree: "Master of Computer Engineering",
    institution: "Stony Brook University",
    location: "New York, USA",
    period: "2023 - 2025",
    description: "",
    highlights: [],
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Stony_Brook_University_seal.svg/800px-Stony_Brook_University_seal.svg.png",
  },
  {
    id: 2,
    degree: "Bachelor of Computer Science and Engineering",
    institution: "NIT Durgapur",
    location: "West Bengal, India",
    period: "2016 - 2020",
    description: "",
    highlights: [],
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSxNCwuM2cjNFHZwomjWF937m09C2R1Xry4L6Z49w8FJW1sesXOjizvzTrFh8kdN6BuY0&usqp=CAU",
  },
];

const Education: React.FC = () => {
  return (
    <section id="education" className="py-12 md:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-white via-purple-50/50 to-indigo-50/50 dark:from-slate-950 dark:via-purple-900/20 dark:to-slate-900 -z-10"></div>

      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-8 md:mb-12">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 md:p-3 rounded-xl">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold ml-3 md:ml-4 text-gray-800 dark:text-white">
              Educational Background
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="backdrop-blur-lg bg-white/40 dark:bg-slate-800/40 rounded-xl p-4 md:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white dark:bg-slate-700 p-2 shadow-md">
                      <img
                        src={edu.logo}
                        alt={`${edu.institution} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder-education.png";
                        }}
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-col">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                          {edu.degree}
                        </h3>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">
                          {edu.institution}
                        </p>
                        <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{edu.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex-grow">
                    {edu.description && (
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                        {edu.description}
                      </p>
                    )}

                    {edu.highlights.length > 0 && (
                      <div className="space-y-2 mt-4">
                        {edu.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 mr-2 mt-1.5"></div>
                            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                              {highlight}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                      {edu.period}
                    </span>
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

export default Education;
