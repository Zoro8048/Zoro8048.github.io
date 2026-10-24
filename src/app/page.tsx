import About from "../components/About";
import Achievements from "../components/Achievements";
import CommandPalette from "../components/CommandPalette";
import Contact from "../components/Contact";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Skills from "../components/Skills";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#0b0d13] text-slate-900 dark:text-slate-100 relative overflow-hidden bg-subtle-grid">
      {/* Soft top radial ambient light */}
      <div
        className="fixed inset-x-0 top-0 h-[36rem] pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.07),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-15%,rgba(59,130,246,0.12),transparent)]"
        aria-hidden="true"
      />

      <CommandPalette />

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Experience />
          <Achievements />
          <Skills />
          <About />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
