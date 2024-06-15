import React from "react";
import { BiBell } from "react-icons/bi";
import { BsChevronExpand } from "react-icons/bs";
import SideBar from "./SideBar";

function TopNav(props: any) {
  return (
    <div className="flex flex-row dark:bg-gray-700 dark:text-gray-400">
      <div className="w-full gap-4 p-3">
        <div className="h-100 w-100 mx-auto flex items-center justify-center rounded-full bg-[#fdf3e6]">
          <img
            src="https://afrisight.com/img/logo.svg"
            alt="AfriSight"
            className="h-8 w-auto"
          />
        </div>
        {props.children}
      </div>
    </div>
  );
}

export default TopNav;
