import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    myName: null,
    myId: "",
    myTurn:undefined,
    myWeapon: "",
    opponentConnection: false,
    roomPassword: ""
};

const gameSlice = createSlice({
    name: "gameSlice",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setMyName: (state, action) => {
            state.myName = action.payload;
        },
        setMyId: (state, action) => {
            state.myId = action.payload;
        },
        setMyTurn: (state, action) => {
            state.myTurn = action.payload;
        },
        setMyWeapon: (state, action) => {
            state.myWeapon = action.payload;
        },
        setOpponentConnection: (state, action) => {
            state.opponentConnection = action.payload;
        },
        setRoomPassword: (state, action) => {
            state.roomPassword = action.payload;
        }
    }
});

export const {
    setUsers,
    setMyId,
    setMyName,
    setMyTurn,
    setMyWeapon,
    setOpponentConnection,
    setRoomPassword,
} = gameSlice.actions;

export default gameSlice.reducer;
