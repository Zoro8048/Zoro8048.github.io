import About from "./components/About";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import "./styles/globals.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-gray-800 dark:text-white relative overflow-hidden">
      {/* Radial gradients for enhanced glassmorphism */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-72 md:w-96 h-72 md:h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-72 md:w-96 h-72 md:h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 -right-40 w-72 md:w-96 h-72 md:h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-72 md:w-96 h-72 md:h-96 bg-teal-400/20 dark:bg-teal-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Achievements />
        <Education />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
