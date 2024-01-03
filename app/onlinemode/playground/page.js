"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Board from "@/components/Board";
import Spinner from "@/components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "@/app/socket";
import {
    setUsers,
    setMyTurn,
    setMyWeapon,
    setOpponentConnection
} from "@/reducers/gameSlice";
import { useRouter } from 'next/navigation'
 
export default function Page() {
    const router = useRouter();
    const dispatch = useDispatch();
    const users = useSelector(state => state.game.users);
    const myName = useSelector(state => state.game.myName);
    const myId = useSelector(state => state.game.myId);
    const myTurn = useSelector(state => state.game.myTurn);
    const myWeapon = useSelector(state => state.game.myWeapon);
    const roomPassword = useSelector(state => state.game.roomPassword);
    const opponentConnection = useSelector(
        state => state.game.opponentConnection
    );
    const defaultGmData = ["", "", "", "", "", "", "", "", ""];
    const [gmData, setGmData] = useState([...defaultGmData]);
    const [isGame, setIsGame] = useState("");
    const [alertSt, setAlertSt] = useState({msg:null});
    const [nVal, setNVal] = useState(0);
    const [scoreboard, setScoreboard] = useState([0, 0]);
    const [isclient, setIsclient] = useState(false);
    const [ismyTurn, setIsmyTurn] = useState(myTurn);
    const alertToast = useRef(null);
    useEffect(() => {
        if (!myName || !myId) {
            router.push("/onlinemode");
        }
    }, []);
    const checkIsGame = provGmData => {
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

    const handleClick = ind => {
        if (ismyTurn) {
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
                setIsmyTurn(false);
                setNVal(p => p + 1);
                socket.emit("moved", {
                    myId,
                    roomPassword,
                    gmData: [...newArr]
                });
            }
        }
    };

    const restartGame = () => {
        socket.emit("restart", { roomPassword, myId, myTurn });
    };
    const setRestart = data => {
        setAlertSt({ msg: "" });
        setGmData([...defaultGmData]);
        setIsGame("");
        setNVal(0);
        if (myId == data.turn) {
            setMyTurn(true);
            setIsmyTurn(true);
        } else {
            setMyTurn(false);
            setIsmyTurn(false);
        }
    };
    useEffect(() => {
        setIsclient(true);
        socket.on("opponentJoined", players => {
            dispatch(setOpponentConnection(true));
            dispatch(setUsers(players));
        });
        socket.on("opponentPlay", data => {
            if (data.to == myId) {
                setGmData(data.gmData);
                setIsmyTurn(true);
                checkIsGame(data.gmData);
                let cNv = 0;
                for (let i = 0; i < gmData.length; i++) {
                    if (gmData[i] !== "") {
                        cNv++;
                    }
                }
                setNVal(cNv);
            }
        });
        socket.on("restart", setRestart);
        socket.on("opponentLeft", () => {
            alertToast.current = toast.error("Opponent left the game!");
            router.push("/onlinemode");
        });
    }, [router,myId]);
    useEffect(() => {
        if (isGame !== "") {
            if (isGame == users[0].weapon) {
                setScoreboard(prev => [prev[0] + 1, prev[1]]);
            } else {
                setScoreboard(prev => [prev[0], prev[1] + 1]);
            }
            setAlertSt({ msg: `${isGame} wins the game` });
        }
    }, [isGame]);

    useEffect(() => {
        if (nVal == gmData.length) {
            if (!isGame) {
                setAlertSt({ msg: "That,s a tie!" });
            }
        }
    }, [nVal]);
    useEffect(()=>{
    if (!myId) {
        router.push("/onlinemode");
    }},[router])
    const handleLeave = () => {
        socket.emit("leavegame", roomPassword);
        alertToast.current = toast.success("Left the game!");
        router.push("/onlinemode");
    };
    if (!opponentConnection) {
        return (
            <main className="w-full bg-gray-900 h-screen flex flex-col items-center font-sans py-5">
            <div className="text-white bg-stone-950 p-5 h-24 rouded shadow text-base">
            Waiting for Opponent to Join
            <Spinner/>
            </div>
            </main>
        );
    }
    return (
        <main className="w-full bg-gray-900 h-screen flex flex-col items-center  font-sans py-5">
            <div className="flex w-full justify-start px-3">
                <button
                    className="p-1 text-white bg-green-500 rounded shadow flex"
                    onClick={handleLeave}
                >
                    <svg
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                        height="1.5em"
                        width="1.5em"
                    >
                        <path
                            fill="currentColor"
                            d="M32.25 31.65q-.45-.45-.45-1.1 0-.65.45-1.05l4-4h-16q-.65 0-1.075-.425-.425-.425-.425-1.075 0-.65.425-1.075.425-.425 1.075-.425h15.9l-4.05-4.05q-.4-.4-.4-1.025 0-.625.45-1.075.45-.45 1.075-.45t1.075.45L40.95 23q.25.25.35.5.1.25.1.55 0 .3-.1.55-.1.25-.35.5l-6.6 6.6q-.4.4-1.025.4-.625 0-1.075-.45ZM9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h13.05q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075Q22.7 9 22.05 9H9v30h13.05q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075Q22.7 42 22.05 42Z"
                        />
                    </svg>                    Leave Game
                </button>
            </div>
            <div className="flex flex-col justify-center items-center">
                <h2 className="text-white text-xl"> ScoreBoard</h2>
                <table className="text-white border border-gray-900 bg-gray-800 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="border border-gray-900">
                            <th className="border border-gray-900 p-1 bg-indigo-500">
                                {users[0].name}
                            </th>
                            <th className="border border-gray-900 p-1 bg-yellow-500">
                                {users[1].name}
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
                {ismyTurn ? "Your,s Turn" : "Opponent,s Turn"}
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
