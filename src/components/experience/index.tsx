import { EXPERIENCES } from "./constants";

export function Experience() {
  return (
    <div className={"shadow p-3 mt-5"}>
      <h1 className={"primary-text text-center"}>Experience</h1>
      <div className={"row"}>
        {EXPERIENCES.map((experience) => (
          <div key={experience.company} className={"col-12 col-md-6"}>
            <Company
              company={experience.company}
              logo={experience.logo}
              position={experience.position}
              duration={experience.duration}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  company: string;
  logo: string;
  position: string;
  duration: string;
  content?: string;
}
function Company(props: Props) {
  return (
    <div
      id="experience"
      className={"shadow p-3 mb-3 d-flex flex-column align-items-center"}
    >
      <h3 className={"tertiary-text pb-1"}>{props.company}</h3>
      <img
        src={props.logo}
        className={"br-50 img-circular"}
        alt={"company-logo"}
        width={80}
        height={80}
      />
      <h4 className={"tertiary-text pt-4 text-center"}>{props.position}</h4>
      <h6 className={"tertiary-text"}>{props.duration}</h6>
      {!!props.content && (
        <p className={"primary-text pt-4 text-center"}>{props.content}</p>
      )}
    </div>
  );
}
