import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Button from '../../../components/shared/button';
import { Link, useParams } from 'react-router-dom';
import { useFetchBusinessCustomerDetails, useFetchCustomer } from '../../../hooks/queries/customer';
import { useNavigate } from 'react-router-dom';

function Customer() {
    const perPage = 10;
    const { id } = useParams()
    const [page, setPage] = useState(1);
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const { data: customerData, isPending, isError } = useFetchCustomer(page, perPage, search);


    console.log(customerData)

    const totalCustomers = Array.isArray(customerData) ? customerData.length : 0;
    const totalPages = Math.ceil(totalCustomers / perPage);
    const handleViewCustomer = (id) => {
        navigate(`/view_details/${id}`)
    }

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };
    const handleCustomer = (id) => {
        navigate(`/customer-details/${id}`);
    }
    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="px-6">
            <div className="inline-block min-w-full rounded-lg overflow-hidden">
                <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
                    <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">Customer</h1>

                    <div className="relative w-full md:w-[700px]">
                        <input
                            type="text"
                            placeholder="Search customer name"
                            value={search}
                            onChange={handleSearch}
                            className="w-full px-3 py-2 pl-8 mt-1 text-xs font-[400] text-[#202224] rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none"
                        />
                        <span className="absolute left-3 top-[22px] transform -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                    </div>
                    <Link to="/addcustomer">
                        <Button
                            label="Create Customer"
                            variant="solid"
                            size="md"
                            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                        />
                    </Link>
                </div>

                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-12 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">ID</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Business name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Date created</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">State</th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Edit</th>
                            <th className="px-1 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">View</th>
                            <th className="px-12 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Loan application</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(customerData) && customerData.slice((page - 1) * perPage, page * perPage).map((item, index) => {
                            const { id, full_name, created_at, Business } = item;

                            return (
                                <tr className="bg-white" key={index}>
                                    <td className="px-12 border-b border-gray-200 bg-white text-xs">
                                        <p className="font-[500] whitespace-no-wrap text-xs">{id}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="font-[500] whitespace-no-wrap text-xs">{full_name}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                        <p className="font-[500] whitespace-no-wrap text-xs">{Business?.name || 'N/A'}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                        <p className="font-[500] whitespace-no-wrap text-xs">{new Date(created_at).toLocaleString()}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                        <p className="font-[500] whitespace-no-wrap text-xs">{Business?.state || 'NA'}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white flex">
                                        <button
                                            className="flex items-center justify-center w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                                            aria-label="Edit"
                                            onClick={(e) => handleCustomer(id)}
                                        >
                                            <FaEdit className="text-gray-500 text-lg" />
                                        </button>
                                    </td>
                                    <td className=" border-b border-gray-200 bg-white">
                                        <button
                                            className="flex items-center justify-center w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                                            aria-label="Edit"
                                            onClick={(e) => handleViewCustomer(id)}
                                        >
                                            <FaEye className="text-gray-500 text-lg" />
                                        </button>
                                    </td>
                                    <td className='border-b px-9 border-gray-200 bg-white'>
                                        <Link to={`/create_application/${id}`}>
                                            <Button
                                                label="Create Application"
                                                variant="solid"

                                                size="md"
                                                className="text-sm px-6 py-5"
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}


                    </tbody>
                </table>

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`px-4 py-2 text-white ${page === 1 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} rounded-lg`}
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 text-white ${page === totalPages ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} rounded-lg`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Customer;
