import loading from "@/components/loading.gif";
import Image from 'next/image'

export default function Spinner(){
    return (
        <div className="flex justify-center items-center">
            <Image src={loading} width={100} height={100} alt="Loading..." />
        </div>
    );
}
