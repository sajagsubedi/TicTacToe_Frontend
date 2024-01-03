"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { toast } from "react-toastify";
import socket from "@/app/socket";
import { useRouter } from 'next/navigation'
import {
    setUsers,
    setMyName,
    setMyWeapon,
    setMyTurn,
    setMyId,
    setRoomPassword,
    setOpponentConnection
} from "@/reducers/gameSlice";

export default function Page() {
    const router = useRouter();
    const [modal, setModal] = useState({ state: false, type: "" });
    const dispatch = useDispatch();
    const myName = useSelector(state => state.game.myName);
    const myId = useSelector(state => state.game.myId);
    const waitingToast = useRef(null);
    const resultToast = useRef(null);

    const togglemodal = (state, type = "") => {
        setModal({ state, type });
    };

    useEffect(() => {
        dispatch(setOpponentConnection(false));
        dispatch(setMyName(""));
        dispatch(setUsers([]));
        dispatch(setMyId(""));
        dispatch(setMyWeapon(""));
        dispatch(setMyTurn(""));
        dispatch(setRoomPassword(""));
        socket.on("gameCreated", data => {
            toast.dismiss(waitingToast.current);
            const { roomPassword, players } = data;
            dispatch(setMyName(players[0].name));
            dispatch(setMyId(players[0].id));
            dispatch(setRoomPassword(roomPassword));
            dispatch(setMyWeapon(players[0].weapon));
            dispatch(setUsers(players));
            dispatch(setMyTurn(true));
            if (!resultToast.current) {
                toast.dismiss(resultToast.current);
                resultToast.current = toast.success("Created Game!");
            }
        });

        socket.on("joinedGame", data => {
            const { roomPassword, users, name, id, weapon } = data;
            toast.dismiss(waitingToast.current);
            dispatch(setRoomPassword(roomPassword));
            dispatch(setMyName(name));
            dispatch(setMyId(id));
            dispatch(setUsers(users));
            dispatch(setMyWeapon(weapon));
            dispatch(setMyTurn(false));
            dispatch(setOpponentConnection(true));
            if (!resultToast.current) {
                toast.dismiss(resultToast.current);
                resultToast.current = toast.success("Joined Game!");
            }
        });
        socket.on("roomFull", () => {
            toast.dismiss(waitingToast.current);
            if (!resultToast.current) {
                toast.dismiss(resultToast.current);
                resultToast.current = toast.error("Game is already full!");
            }
        });

        socket.on("roomNotFound", () => {
            toast.dismiss(waitingToast.current);
            if (!resultToast.current) {
                toast.dismiss(resultToast.current);
                resultToast.current = toast.error("No such game found!");
            }
        });
        return () => {
            socket.off("gameCreated");
            socket.off("joinedGame");
            socket.off("roomFull");
            socket.off("roomNotFound");
        };
    }, [dispatch]);
    
    useEffect(() => {
        if (myId !== "" && router.pathname !== "onlinemode/playground") {
            router.push("onlinemode/playground");
        }
    }, [myId,router]);

    return (
        <main className="flex flex-col items-center py-5 px-3">
            {modal.state && (
                <Modal
                    type={modal.type}
                    togglemodal={togglemodal}
                    waitingToast={waitingToast}
                />
            )}
            <Link
                className="p-1 text-white bg-green-500 rounded shadow flex self-start mb-6"
                href="/"
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
            <div className="w-64 bg-gray-800 rounded-lg flex flex-col items-center text-white p-7">
                <h2 className="text-xl font-bold nowrap tracking-tight mb-3">
                    What,s your choice?
                </h2>
                <div className="flex flex-col w-full px-3 space-y-2">
                    <button
                        className="w-full py-1 px-2 rounded-md bg-blue-500"
                        onClick={() => togglemodal(true, "create")}
                    >
                        Create Game
                    </button>
                    <button
                        className="w-full py-1 px-2 rounded-md bg-pink-500"
                        onClick={() => togglemodal(true, "join")}
                    >
                        Join Game
                    </button>
                </div>
            </div>
        </main>
    );
}
