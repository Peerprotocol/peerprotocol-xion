import Image from "next/image";
import '../../../src/app/globals.css';

const Dashboard = () => {
    return ( 
        <div className="bg-[#FFFFFF] border rounded-lg grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10 py-5 px-5">
            <div className="relative bg-smoke-white py-14 px-4 border rounded-lg">
                <p className="text-gray-500 text-xs">Total Value Locked</p>
                <p className="text-black font-semibold text-2xl md:text-4xl pt-2 redhat">$20.04M</p>
                <Image className="cursor-pointer absolute top-3 right-3" src="./images/info.svg" width={0} height={30} alt="images"/>
                <Image src="/images/greenchart.svg" alt="greenChart" width={150} height={0} className="absolute bottom-1"/>
            </div>
            <div className="relative bg-smoke-white py-14 px-4 border rounded-lg">
                <p className="text-gray-500 text-xs">Total Lend Value</p>
                <p className="text-black font-semibold text-2xl md:text-4xl pt-2 redhat">$13.308M</p>
                <Image src="/images/greenchart.svg" alt="greenChart" width={150} height={0} className="absolute bottom-1"/>
            </div>
            <div className="relative bg-smoke-white py-14 px-4 border rounded-lg">
                <p className="text-gray-500 text-xs">Total Borrow Value</p>
                <p className="text-black font-semibold text-2xl md:text-4xl pt-2">$6.680M</p>
                <Image src="/images/redchart.svg" alt="redChart" width={150} height={0} className="absolute bottom-1"/>
            </div>
            <div className="relative bg-smoke-white py-14 px-4 border rounded-lg">
                <p className="text-gray-500 text-xs">Active P2P Deals</p>
                <p className="text-black font-semibold text-2xl md:text-4xl pt-2">3536</p>
                <Image className="cursor-pointer absolute top-3 right-3" src="./images/info.svg" width={30} height={30} alt="images"/>
            </div>
            <div className="relative bg-smoke-white py-14 px-4 border rounded-lg">
                <p className="text-gray-500 text-xs">Completed P2P deals</p>
                <p className="text-black font-semibold text-2xl md:text-4xl pt-2">856</p>
                <Image className="cursor-pointer absolute top-3 right-3" src="./images/info.svg" width={30} height={30} alt="images"/>
            </div>
            <div className="relative bg-smoke-white py-14 px-4 border rounded-lg">
                <p className="text-gray-500 text-xs">Total Interest Paid</p>
                <p className="text-black font-semibold text-2xl md:text-4xl pt-2">$142.05K</p>
                <Image className="cursor-pointer absolute top-3 right-3" src="./images/info.svg" width={30} height={30} alt="images"/>
                <Image src="/images/redchart.svg" alt="greenChart" width={150} height={0} className="absolute bottom-1"/>
            </div>
        </div>
     );
}
 
export default Dashboard;