import { ArrowDown } from "lucide-react";
import React from "react";

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-indigo-950 -z-10"></div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-teal-400 dark:bg-teal-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
            Keerthan
          </h1>

          <div className="backdrop-blur-lg bg-white/30 dark:bg-slate-900/30 p-8 rounded-2xl shadow-glass mb-8">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200 mb-4">
              Software Engineer
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              I build beautiful, functional, and accessible applications with a
              focus on user experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Get in Touch
              </a>
              <a
                href="#experience"
                className="px-6 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-gray-800 dark:text-white rounded-lg hover:bg-white/90 dark:hover:bg-slate-800/90 transition-colors border border-gray-200 dark:border-gray-700 shadow-md"
              >
                View Experience
              </a>
            </div>
          </div>

          <a
            href="#about"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-gray-800 dark:text-white hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors animate-bounce mt-8 shadow-sm"
          >
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
