"use client";
import React, { useState, useEffect } from "react";
import socket from "@/app/socket";
import { toast } from "react-toastify";

export default function Modal(props) {
  const { type, togglemodal, waitingToast } = props;
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    weapon: "",
  });
  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    if (type == "join") {
      waitingToast.current = toast.info("Joining game...");
      socket.emit("joinGame", formData);
    } else if (type == "create") {
      waitingToast.current = toast.info("Creating game...");
      socket.emit("createGame", formData);
    }
    togglemodal();
  };

  return (
    <div className="h-auto max-w-80 mx-5 backdrop-blur-3xl bg-indigo-500 bg-opacity-10 absolute top-10 box-border rounded-lg p-10 shadow-2xl flex flex-col items-center">
      <h2 className="text-2xl text-white">
        {type == "create" ? "Create" : "Join"} Room
      </h2>
      <form
        className="flex flex-col space-y-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label htmlFor="name" className="leading-7 text-sm text-gray-400">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handelChange}
            placeholder="Enter your name"
            className="w-full bg-gray-900 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>

        <div>
          <label
            htmlFor="roompassword"
            className="leading-7 text-sm text-gray-400"
          >
            Room password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password for room"
            value={formData.password}
            onChange={handelChange}
            className="w-full bg-gray-900 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        {type == "create" && (
          <div className="text-gray-400">
            <label htmlFor="weapon" className="leading-7 text-sm text-gray-400">
              Choose your Weapon
            </label>
            <div className="flex w-full space-x-8">
              <div className="flex space-x-1">
                <input
                  type="radio"
                  value="O"
                  name="weapon"
                  checked={formData.weapon == "O"}
                  onChange={(e) => setFormData({ ...formData, weapon: "O" })}
                />
                <label htmlFor="O">O</label>
              </div>
              <div className="flex space-x-1">
                <input
                  type="radio"
                  value="X"
                  name="weapon"
                  checked={formData.weapon == "X"}
                  onChange={(e) => setFormData({ ...formData, weapon: "X" })}
                />
                <label htmlFor="X">X</label>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center space-x-5">
          <button
            className="py-1 px-2 bg-gray-900 border border-indigo-500 ring-2 ring-indigo-900 text-white text-base rounded w-20"
            onClick={() => togglemodal(false)}
          >
            Cancel
          </button>
          <button
            className="py-1 px-2 bg-indigo-600 text-white text-base rounded w-20"
            onClick={handleSubmit}
          >
            {type == "create" ? "Create" : "Join"}
          </button>
        </div>
      </form>
    </div>
  );
}
