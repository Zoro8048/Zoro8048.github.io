import {
  ArrowUpRight,
  Briefcase,
  FileText,
  MapPin,
  MessageSquare,
} from "lucide-react";
import React from "react";

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-12 md:py-20">
      <div className="container mx-auto">
        <div className="mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="section-eyebrow mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Let&apos;s Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Get in Touch
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Direct Recruiter Channels (5 cols) */}
          <div className="lg:col-span-5 bento-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Responsive to Recruiter Outreach
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Let&apos;s build something high-impact.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Open to discussing senior and SDE II+ roles, architectural
                challenges, and engineering opportunities.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-400">
                      Current Role
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      SDE II at Amazon
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-400">
                      Location
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Seattle, WA (Open to US hubs &amp; remote)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-5 border-t border-slate-200/80 dark:border-slate-800/80">
              <a
                href="https://www.linkedin.com/in/keerthan-nandigama-b3b19b175/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-blue-600/20 transition-all"
              >
                <span>Message on LinkedIn</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="https://docs.google.com/document/d/16IA_B_VPAjWNEaUJ3oq2SvG7gOAkZznUMn6qKbL9O94/edit?tab=t.0"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900 hover:border-blue-500/40 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all"
              >
                <span className="inline-flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Resume &amp; Portfolio Doc
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="https://github.com/zoro8048"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900 hover:border-blue-500/40 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all"
              >
                <span>GitHub (@zoro8048)</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Contact Form (7 cols) */}
          <div className="lg:col-span-7 bento-card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Send a Message
              </h3>
              <span className="text-xs text-slate-400">
                Direct to Inbox
              </span>
            </div>
            <div className="rounded-xl overflow-hidden bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70">
              <iframe
                src="https://tally.so/embed/3X4yPV?alignLeft=1&amp;hideTitle=1&amp;transparentBackground=1&amp;dynamicHeight=1"
                title="Contact Keerthan Nandigama"
                height="475"
                width="100%"
                className="w-full border-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
