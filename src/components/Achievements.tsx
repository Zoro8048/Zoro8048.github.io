import { Trophy } from "lucide-react";
import React from "react";

const achievements = [
  {
    id: 1,
    title: "Innovator of the month",
    organization: "CARS24",
    date: "Jan. 2023",
    description:
      "Awarded for improving the performance of a business critical screen by ~40%.",
    logo: "https://fastly-production.24c.in/cars24/seo/static/1_20230830_1693395013.png",
  },
  {
    id: 2,
    title: "Best Coder of the month",
    organization: "CARS24",
    date: "Sep. 2022",
    description:
      "Awarded for configuring an easy way to support different users for multiple geographies(IN, UAE, ID & TH) without hassle along with following best practices while delivering new features for an internal app.",
    logo: "https://fastly-production.24c.in/cars24/seo/static/1_20230830_1693395013.png",
  },
  {
    id: 3,
    title: "Rookie of the Quarter - Tech",
    organization: "CARS24",
    date: "2021 - 2022",
    description:
      "Awarded for quick pickup and adding value to critical business flows in one of the core business applications.",
    logo: "https://fastly-production.24c.in/cars24/seo/static/1_20230830_1693395013.png",
  },
  {
    id: 4,
    title: "Employee of the month",
    organization: "NeoGrowth Credit Pvt. Ltd.",
    date: "Mar. 2021",
    description:
      "Responsible for the development, deployment and maintenance of the company's product 'DiGibizz'(frontend). At the time, youngest to receive the award.",
    logo: "https://neogrowth.in/images/logo/logo_new.svg",
  },
];

const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="py-12 md:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 dark:from-slate-950 dark:via-blue-900/20 dark:to-slate-900 -z-10"></div>

      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-8 md:mb-12">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 md:p-3 rounded-xl">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold ml-3 md:ml-4 text-gray-800 dark:text-white">
              Achievements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="backdrop-blur-lg bg-white/40 dark:bg-slate-800/40 rounded-xl p-4 md:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white dark:bg-slate-700 p-2 shadow-md">
                      <img
                        src={achievement.logo}
                        alt={`${achievement.organization} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder-achievement.png";
                        }}
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-col">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                          {achievement.title}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {achievement.organization}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex-grow">
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                      {achievement.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                      {achievement.date}
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

export default Achievements;
