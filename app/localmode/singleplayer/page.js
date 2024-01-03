"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Board from "@/components/Board";

export default function Page() {
  const defaultGmData = ["", "", "", "", "", "", "", "", ""];
  const [gmData, setGmData] = useState([...defaultGmData]);
  const [isGame, setIsGame] = useState("");
  const [alertSt, setAlertSt] = useState(false);
  const [nVal, setNVal] = useState(0);
  const [scoreboard, setScoreboard] = useState([0, 0]);
  const [isclient, setIsclient] = useState(false);
  const [myWeapon, setMyWeapon] = useState("O");
  const [myTurn, setMyTurn] = useState(true);
  const checkIsGame = (provGmData) => {
    for (let i = 0; i < 3; i++) {
      if (
        provGmData[i] != "" &&
        provGmData[i] == provGmData[i + 3] &&
        provGmData[i] == provGmData[i + 6]
      ) {
        setIsGame(provGmData[i]);
        return;
      } else if (
        provGmData[i * 3] !== "" &&
        provGmData[i * 3] == provGmData[i * 3 + 1] &&
        provGmData[i * 3] == provGmData[i * 3 + 2]
      ) {
        setIsGame(provGmData[i * 3]);
        return;
      }
    }

    if (
      provGmData[0] !== "" &&
      provGmData[0] == provGmData[4] &&
      provGmData[0] == provGmData[8]
    ) {
      setIsGame(provGmData[0]);
      return;
    } else if (
      provGmData[2] !== "" &&
      provGmData[2] == provGmData[4] &&
      provGmData[2] == provGmData[6]
    ) {
      setIsGame(provGmData[2]);
      return;
    }
  };

  const handleClick = (ind) => {
    if (myTurn) {
      if (gmData[ind] == "") {
        let newArr = [...gmData].map((val, i) => {
          if (i == ind) {
            return myWeapon;
          } else {
            return val;
          }
        });
        setGmData([...newArr]);
        checkIsGame([...newArr]);
        setMyTurn(false);
        setNVal((p) => p + 1);
      }
    }
  };

  const restartGame = () => {
    setAlertSt({ msg: "" });
    setGmData([...defaultGmData]);
    setIsGame("");
    setNVal(0);
  };

  useEffect(() => {
    if (isGame !== "") {
      setScoreboard((prev) => {
        return isGame == "O" ? [prev[0] + 1, prev[1]] : [prev[0], prev[1] + 1];
      });
      setAlertSt({
        msg: `${isGame == myWeapon ? "You" : "Computer"} won the game`,
      });
    }
  }, [isGame,myWeapon]);

  const computerPlay = () => {
    let possibilities = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let actpos = {
      mygame: null,
      ind: null,
    };

    const normalMove = () => {
      if (nVal == 9) {
        return;
      }
      let choice = Math.floor(Math.random() * 8);
      if (gmData[choice]) {
        normalMove();
      } else {
        actpos.ind = choice;
      }
    };
    possibilities.map((data, i) => {
      const val1 = gmData[data[0]];
      const val2 = gmData[data[1]];
      const val3 = gmData[data[2]];
      if ((!!val1 && !!val2) || (!!val2 && !!val3) || (!!val3 && !!val1)) {
        if (val1 == val2 || val2 == val3 || val3 == val1) {
          if (!(val1 && val2 && val3)) {
            if (actpos.mygame !== true) {
              if (!val1) {
                actpos.ind = data[0];
              } else if (!val2) {
                actpos.ind = data[1];
              } else {
                actpos.ind = data[2];
              }

              if (val1 == myWeapon || val2 == myWeapon || val3 == myWeapon) {
                actpos.mygame = false;
              } else {
                actpos.mygame = true;
              }
            }
          }
        }
      }
    });
    if (!actpos.ind) {
      normalMove();
    }
    return actpos;
  };

  useEffect(() => {
    if (!myTurn) {
      let gamePossibility = computerPlay();
      let computerChoice = gamePossibility.ind;
      let newGmData = gmData.map((val, i) => {
        if (i == computerChoice) {
          return myWeapon == "O" ? "X" : "O";
        } else {
          return val;
        }
      });
      setMyTurn(true);
      setNVal((p) => p + 1);
      setGmData(newGmData);
      checkIsGame(newGmData);
    }
  }, [myTurn,myWeapon,gmData,computerPlay]);

  useEffect(() => {
    if (nVal == gmData.length) {
      if (!isGame) {
        setAlertSt({ msg: "That,s a tie!" });
      }
    }
  }, [nVal,gmData.length,isGame]);

  useEffect(() => {
    setIsclient(true);
  }, []);
  return (
    <main className="w-full bg-gray-900 h-screen flex flex-col items-center  font-sans py-5">
      <Link
        className="p-1 text-white bg-green-500 rounded shadow flex self-start mx-3"
        href="/localmode"
      >
        <svg
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          height="1.5em"
          width="1.5em"
        >
          <path
            fill="currentColor"
            d="m22.35 38.95-13.9-13.9q-.25-.25-.35-.5Q8 24.3 8 24q0-.3.1-.55.1-.25.35-.5L22.4 9q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05L13.1 22.5h24.8q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075-.425.425-1.075.425H13.1l11.4 11.4q.4.4.4 1t-.45 1.05q-.45.45-1.05.45-.6 0-1.05-.45Z"
          />
        </svg>
        Back
      </Link>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-white text-xl"> ScoreBoard</h2>
        <table className="text-white border border-gray-900 bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="border border-gray-900">
              <th className="border border-gray-900 p-1 bg-indigo-500">
                You ({myWeapon})
              </th>
              <th className="border border-gray-900 p-1 bg-yellow-500">
                Computer ({myWeapon == "O" ? "X" : "O"})
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-900">
              <td className="border border-gray-900 text-center p-1">
                {isclient ? scoreboard[0] : "0"}
              </td>
              <td className="border border-gray-900 text-center p-1">
                {isclient ? scoreboard[1] : "0"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="px-3 py-1 bg-green-500 text-white font-bold rounded shadow w-max  text-xl mt-8">
        {myTurn ? "Your Turn" : `Computer's Turn`}
      </p>
      {alertSt.msg && (
        <div className="h-screen absolute top-0 right-0 w-screen backdrop-blur-2xl flex justify-center z-50">
          <div className="w-60 bg-gray-50 rounded-2xl my-20  p-5 h-32 flex flex-col justify-center items-center shadow-xl">
            <p className="text-2xl"> {alertSt.msg}</p>
            <button
              className="px-3 py-1 bg-green-500 text-white rounded flex justify-end items-center hover:bg-green-600 font-bold"
              onClick={restartGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      <Board data={{ gmData, handleClick }} />
    </main>
  );
}
