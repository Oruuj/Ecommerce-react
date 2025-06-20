import React from "react";
import "./directory.scss";
import { IoIosArrowForward } from "react-icons/io";

const Directory = ({ directory }) => {
  const length = directory.length;
  return (
    <div className="directory">
      <div className="directory-container flex items-center gap-2">
        {directory.map((element, index) => (
          <>
            {index !== 0 && <IoIosArrowForward />}
            <span
              className={
                index === length - 1
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }
            >
              {element}
            </span>
          </>
        ))}
      </div>
    </div>
  );
};

export default Directory;
