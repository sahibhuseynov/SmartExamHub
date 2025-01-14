import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const UserBalance = () => {
    const currentBalance = 50; // Example: Static balance value

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Balansım</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Balance Display Card */}
                <div className="bg-white rounded-b-lg border-t-8 border-blue-500 px-4 py-5 flex flex-col justify-around shadow-md rounded-lg">
                    <p className="text-lg font-bold font-sans">Cari Balans</p>
                    <div className="py-3">
                        <p className="text-sm">
                             <span className="font-bold text-2xl">{currentBalance} ₼</span>
                        </p>
                    </div>
                </div>

                {/* Add Balance Card */}
                <div className="bg-white rounded-b-lg border-t-8 border-green-400 px-4 py-5 flex flex-col justify-around shadow-md rounded-lg">
                    <p className="text-lg font-bold font-sans">Balansı Artır</p>
                    <div className="py-3">
                        <Link to='/payment' className="btn btn-success  gap-2  text-white  ">
                            <IoAddCircleOutline size={24} />
                            Artır
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserBalance;
