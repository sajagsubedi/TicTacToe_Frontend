import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Tic Tac Toe",
  description: " A multiplayer tic tac toe game that can be used to play tuc tac toe with your friends online or locally also allowing to play with computer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="h-screen w-screen bg-gray-900">
          {children}
          <ToastContainer
            position="top-left"
            theme="dark"
            autoClose={3000}
            style={{ width: "230px" }}
          />
          <script src="//cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
        </main>
      </body>
    </html>
  );
}
