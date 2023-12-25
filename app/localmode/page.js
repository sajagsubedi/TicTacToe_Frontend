import Link from "next/link";
export default function Page (){
  return (
    <div className="flex flex-col text-white items-center py-5">
      <Link
        className="p-1 text-white bg-green-500 rounded shadow flex self-start mx-3"
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
      <div className="flex flex-col space-y-5 w-72">
        <h2 className="text-xl font-bold my-5 tracking-tight">
          Choose the player mode
        </h2>
        <button className="px-2 py-2 bg-blue-500 rounded">
          <Link href="/localmode/singleplayer"> Human v/s Computer</Link>
        </button>
        <button className="px-2 py-2 bg-pink-500 rounded">
          <Link href="/localmode/multiplayer">Human v/s Human Mode</Link>
        </button>
      </div>
    </div>
  );
};
