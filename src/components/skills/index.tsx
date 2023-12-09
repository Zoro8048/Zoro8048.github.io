import { SKILLS } from "./constants";

export function Skills() {
  return (
    <div id="skills" className={"p-3 mt-5"}>
      <h1 className={"secondary-text text-center"}>SKILLS</h1>
      <div
        className={"d-flex mx-4 px-0 px-md-4"}
        style={{
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {SKILLS.map((skill) => (
          <div key={skill} className={"shadow p-4 secondary-text mx-2"}>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}
