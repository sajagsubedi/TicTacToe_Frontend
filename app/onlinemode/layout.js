"use client"
import store from "@/app/store";
import { Provider } from "react-redux";

export default function RootLayout({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
