import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-8 backdrop-blur-lg bg-white/30 dark:bg-slate-900/30 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex w-1/2 justify-end items-center">
            <p className="text-gray-700 dark:text-gray-300 py-2">
              Keerthan Nandigama
            </p>
          </div>

          <div>
            <a
              href="#hero"
              className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Back to Top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
