import React from "react";

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white to-indigo-50 dark:from-slate-950 dark:to-slate-900 -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
            About Me
          </h2>

          <div className="backdrop-blur-lg bg-white/40 dark:bg-slate-900/40 rounded-2xl shadow-glass p-8 md:p-10">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="w-full">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  I'm Keerthan Nandigama, a Software Engineer with a strong
                  track record of building scalable, user-centric applications
                  across mobile and web platforms. With a background in Computer
                  Science and a Master's in Computer Engineering from Stony
                  Brook University, I bring a blend of deep technical knowledge
                  and practical industry experience.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Previously, I contributed to high-impact applications at
                  CARS24 and NeoGrowth, leading cross-functional initiatives
                  that improved performance, scalability, and user engagement.
                  I'm passionate about clean architecture, analytics-driven
                  development, and optimizing performance at scale. Whether it's
                  React Native, Flutter, Spring Boot, or full-stack web
                  development, I enjoy delivering robust solutions that make a
                  difference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
