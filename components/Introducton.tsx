import deved from "../public/dev-ed-wave.png";
import Image from "next/image";

const Introduction = ({ isUserKorean }) => {
  return (
    <div className="text-center p-10 py-10">
      <h2 className="text-5xl py-2 text-teal-600 font-medium dark:text-teal-400 md:text-6xl">
        {`Jinseok Seo`}
        {isUserKorean && <span className="text-sm">(서진석)</span>}
      </h2>
      <h3 className="text-2xl py-2 dark:text-white md:text-3xl">
        {`${isUserKorean ? "프론트엔드 개발자" : "Front End Developer."}`}
      </h3>
      <p className="text-sm py-5 leading-8 text-gray-800 dark:text-gray-200 max-w-xl mx-auto md:text-base">
        {`${
          isUserKorean
            ? "프론테 엔드 개발자 이지만 웹 어셈블리와 클라우드를 지향하는 풀스택 개발자가 목표입니다."
            : "A Front-end Dev that lives by Great web design without functionality is like a sports car with no engine"
        }`}
      </p>
      <div className="text-5xl flex justify-center gap-16 py-3 text-gray-600 dark:text-gray-400">
        <i
          className="fa-brands fa-twitter hover:text-[#1DA1F2] transition ease-linear duration-150 cursor-pointer"
          onClick={() => {
            window.open("https://career.programmers.co.kr/pr/jinseok9338");
          }}
        ></i>
        <i
          className="fa-brands fa-linkedin hover:text-[#0072b1] transition ease-linear duration-150 cursor-pointer"
          onClick={() => {
            window.open(
              "https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile"
            );
          }}
        ></i>
        <i
          className="fa-brands fa-github hover:text-[#333] transition ease-linear duration-150 cursor-pointer"
          onClick={() => {
            window.open("https://www.github.com/jinseok9338");
          }}
        ></i>
      </div>
      <div className="mx-auto bg-gradient-to-b from-teal-500 rounded-full w-80 h-80 relative overflow-hidden mt-20 md:h-96 md:w-96">
        <Image src={deved} layout="fill" objectFit="cover" alt="" />
      </div>
    </div>
  );
};

export default Introduction;
