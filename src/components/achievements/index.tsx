import { ACHIEVEMENTS } from "./constants";

export function Achievements() {
  return (
    <div className={"shadow p-3 mt-5"}>
      <h1 className={"primary-text text-center"}>Achievements</h1>
      <div className={"row"}>
        {ACHIEVEMENTS.map((achievement, index) => (
          <div key={achievement.title + index} className={"col-12 col-md-6"}>
            <Achievement
              title={achievement.title}
              logo={achievement.logo}
              duration={achievement.duration}
              content={achievement.content}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  title: string;
  logo: string;
  duration: string;
  content?: string;
}
function Achievement(props: Props) {
  return (
    <div className={"shadow p-3 mb-3 d-flex flex-column align-items-center"}>
      <h3 className={"tertiary-text pb-1 text-center"}>{props.title}</h3>
      <h6 className={"tertiary-text pb-1"}>{props.duration}</h6>
      <img
        src={props.logo}
        className={"br-50 img-circular"}
        alt={"company-logo"}
        width={80}
        height={80}
      />
      {!!props.content && (
        <p className={"primary-text pt-4 text-center"}>{props.content}</p>
      )}
    </div>
  );
}
