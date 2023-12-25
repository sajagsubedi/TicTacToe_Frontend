import loading from "./loading.gif";

export default function Spinner(){
    return (
        <div className="flex justify-center items-center">
            <img src={loading} alt="Loading..." />
        </div>
    );
}
