import Link from "next/link";
export default function Page(){
  return (
    <div className="flex flex-col text-white items-center p-10">
      <h1 className="text-3xl font-bold my-5">Tic Tac Toe</h1>
      <div className="flex flex-col space-y-5">
        <h2 className="text-2xl font-bold my-5">Choose the game mode</h2>
        <button className="px-2 py-2 bg-blue-500 rounded">
          <Link href="/localmode">Local Mode</Link>
        </button>
        <button className="px-2 py-2 bg-pink-500 rounded">
          <Link href="/onlinemode">Online Mode</Link>
        </button>
      </div>
    </div>
  );
};
