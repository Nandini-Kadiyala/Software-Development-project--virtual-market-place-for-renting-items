import React from "react";

const CustomSwitch = ({ currOption, setOption, options = [] }) => {
  return (
    <div className="rounded-lg shadow-xl bg-white flex items-center justify-center w-fit">
      {options.map((option) => (
        <div
          key={option}
          className={`${
            currOption === option ? "bg-black text-white" : "bg-white"
          }
                    px-10 h-8 w-10 text-sm rounded-lg flex items-center justify-center cursor-pointer`}
          onClick={() => setOption(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default CustomSwitch;
