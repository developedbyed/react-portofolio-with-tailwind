import { Dispatch, SetStateAction } from "react";

interface iNavBarProps {
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  darkMode: boolean;
  isUserKorean: boolean;
}

const NavBar = ({ setDarkMode, darkMode, isUserKorean }: iNavBarProps) => {
  return (
    <nav className="py-10 mb-12 flex justify-between dark:text-white">
      <h1 className="font-burtons text-xl">UsernameJ9338</h1>
      <ul className="flex items-center">
        <li>
          <i
            className={` ${
              darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"
            } cursor-pointer text-2xl`}
            onClick={() => setDarkMode((prev) => !prev)}
          ></i>
        </li>
        <li>
          <a
            className="bg-gradient-to-r from-cyan-500 text- to-teal-500 text-white px-4 py-2 border-none rounded-md ml-8"
            href="https://career.programmers.co.kr/job_profiles/public_setting" // this is for the real Resume
          >
            {`${isUserKorean ? "이력서" : "Resume"}`}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
