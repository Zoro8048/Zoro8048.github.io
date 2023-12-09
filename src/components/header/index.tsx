import { useState } from "react";

export function Header() {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div>
      <div className={"row py-5 justify-content-center"}>
        <h3 className={"col primary-text"}>KN.</h3>
        <div className={"col-6 menu-option"} />
        <div className={"col secondary-text menu-option"}>
          <a href="#education">education</a>
        </div>
        <div className={"col secondary-text menu-option"}>
          <a href="#experience">experience</a>
        </div>
        <div className={"col secondary-text menu-option"}>
          <a href="#skills">skills</a>
        </div>
        <div className={"col secondary-text menu-option"}>
          <a href="#contact">contact</a>
        </div>
        <div
          className={"col-2 hamburger"}
          onClick={() => setShowOptions(!showOptions)}
        >
          <img
            src={require("../../icons/hamburger.png")}
            width={40}
            height={40}
            alt="menu"
          />
        </div>
      </div>
      {showOptions && (
        <div
          style={{ flexDirection: "column", marginTop: -40, marginBottom: 10 }}
        >
          <a href="#education">education</a>
          <br />
          <br />
          <a href="#experience">experience</a>
          <br />
          <br />
          <a href="#skills">skills</a>
          <br />
          <br />
          <a href="#contact">contact</a>
          <br />
          <br />
          <div style={{ height: 1, backgroundColor: "#BDBDDD50" }} />
          <br />
        </div>
      )}
    </div>
  );
}
