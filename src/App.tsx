import { useEffect, useState } from "react";
import { About } from "./components/about";
import { Achievements } from "./components/achievements";
import { Contact } from "./components/contact";
import { Education } from "./components/education";
import { Experience } from "./components/experience";
import { Header } from "./components/header";
import { Skills } from "./components/skills";

function App() {
  const [showArrow, setShowArrow] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setShowArrow(window.scrollY > 150);
    });
    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);
  return (
    <div className={"container"}>
      <Header />
      <About />
      <Education />
      <Experience />
      <Achievements />
      <Skills />
      <Contact />
      <footer className={"footer text-center py-5"}>
        <a href="/">Keerthan Nandigama</a>
      </footer>
      {showArrow && (
        <div
          className={"floating-arrow"}
          onClick={() =>
            window.scrollTo({
              top: 0,
            })
          }
        >
          <img
            src={require("./icons/up-arrow.png")}
            alt={"icon-up"}
            width={48}
            height={48}
          />
          ;
        </div>
      )}
    </div>
  );
}

export default App;
