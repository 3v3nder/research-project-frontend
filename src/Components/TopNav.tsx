import React from 'react'
import { BiBell } from "react-icons/bi";
import { BsChevronExpand } from "react-icons/bs";
import SideBar from './SideBar';
function TopNav(props:any) {
  return (
    <div className="flex flex-row  dark:bg-gray-700 dark:text-gray-400">
      <div className="  ">
        <SideBar/>
      </div>

      <div className=" w-full p-3 gap-4">
        <div className=" pt-2 2xl:pt-4 pb-2 2xl:pb-4 pr-2  flex flex-row justify-between border-b">
          <div className="">
          <form className="">
      <div className="relative w-full md:min-w-[500px] ml-5">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          className="w-full bg-gray-50   text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-200 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search"
          required
        ></input>
      </div>
    </form>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-row-reverse ">
            <div className="">
      <button
        type="button" 
        className="inline-flex relative items-center p-3 text-sm font-medium text-center text-gray-700 bg-white rounded-lg hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <div className="font-2xl">
          <BiBell />
        </div>

        <div className="inline-flex absolute -top-2 -right-2 justify-center items-center w-2 h-2 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">
          .
        </div>
      </button>
    </div>
            </div>

            <div className="mr-2 pl-2">
              {" "}
              <div className="flex items-center space-x-4 border-l pl-4">
      <div className="flex-shrink-0">
        <img
          className="w-8 h-8 rounded-full"
          src="https://source.unsplash.com/75x75/?portrait"
          alt="Neil image"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
          Neil Sims
        </p>
        <p className="flex flex-row gap-3 text-sm text-gray-500 truncate dark:text-gray-400">
          email@windster.com{" "}
          <div>
            <BsChevronExpand />
          </div>
        </p>
      </div>
    </div>{" "}
            </div>
          </div>
        </div>

        {props.children}
      </div>
    </div>
  )
}

export default TopNav