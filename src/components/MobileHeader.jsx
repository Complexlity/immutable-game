"use client"

import logo from "@/assets/github-light.png";
import Scoreboard from "./Scoreboard";

// This works the same as the Header component but is separated just to improve responsiveness
const MobileHeader = ({ score, bestScore, max }) => {
  return (
    <div className="mb-4 pt-4 sm:hidden">
      <div className="mb-4 flex items-center gap-2 px-6">
        <h1 className="main-header flex-1 text-center text-xl text-gray-200">
          Test Your Memory
        </h1>
        <a href="https://github.com/Complexlity/immutable-game" target={"_blank"}>
          <img className="w-[2.5rem]" src={logo} alt="" />
        </a>
      </div>
      <Scoreboard score={score} bestScore={bestScore} max={max} />
    </div>
  );
};

export default MobileHeader;
