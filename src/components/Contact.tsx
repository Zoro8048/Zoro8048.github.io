import { MapPin } from "lucide-react";
import React from "react";

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white to-teal-50 dark:from-slate-950 dark:to-slate-900 -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
            Get In Touch
          </h2>

          <div className="backdrop-blur-lg bg-white/40 dark:bg-slate-900/40 rounded-2xl shadow-glass p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 mr-4">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                        Location
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Seattle, WA
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Follow Me
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.linkedin.com/in/keerthan-nandigama-b3b19b175/"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-gray-200 dark:bg-slate-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a
                      href="https://x.com/keertha74261356"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-gray-200 dark:bg-slate-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Send Me a Message
                </h3>
                <iframe
                  src="https://tally.so/embed/3X4yPV?alignLeft=1&amp;hideTitle=1&amp;transparentBackground=1&amp;dynamicHeight=1"
                  title="contact"
                  height="475"
                  width="100%"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
