import { locale } from "../../constants/locale";

export function About() {
  return (
    <div id="about">
      <div>
        <h1 className={"tertiary-text text-center"}>
          {locale.helloName}
          <span className={"primary-text"}>{locale.name}.</span>
        </h1>
        <h2 className={"tertiary-text text-center"}>{locale.title}</h2>
      </div>
      <p className={"mx-md-5 px-5 pt-5 pb-5 secondary-text text-center"}>
        {locale.about}
      </p>
    </div>
  );
}
