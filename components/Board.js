"use client";

export default function Board({ data }) {
  const { gmData, handleClick } = data;
  return (
    <div className="flex flex-wrap h-60 w-60 justify-center gap-5 mt-2">
      {gmData.map((val, i) => {
        return (
          <div
            key={i}
            className={`bg-gray-800 flex items-center justify-center text-5xl font-bold rounded-lg box-border h-16 w-16 text-white ${
              gmData[i] !== "" &&
              (gmData[i] === "O" ? "bg-indigo-500" : "bg-yellow-500")
            }`}
            onClick={() => handleClick(i)}
          >
            {val}
          </div>
        );
      })}
    </div>
  );
};
