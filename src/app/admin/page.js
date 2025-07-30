"use client";
// app/admin/page.js
import withAdminAuth from "@/components/Admin/withAdminAuth";
import AdminLogoutButton from "@/components/Admin/AdminLogoutButton";
import Link from "next/link";

const AdminPage = (props) => {
    return (
            <section className="flex flex-col py-16 px-8 md:px-40 bg-white text-black min-h-screen">
                <div className="flex flex-col items-center justify-center space-y-8 mt-10">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage your website content and settings</p>
                    </div>

                    {/* Admin Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl">
                        {/* Add Map Card */}
                        <Link href="/admin/add-map" className="group">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Add Map</h3>
                                        <p className="text-gray-600">Create new game maps</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Edit Map Card */}
                        <Link href="/admin/edit-map" className="group">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Edit Map</h3>
                                        <p className="text-gray-600">Modify existing maps</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Add Nade Card */}
                        <Link href="/admin/add-nade" className="group">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Add Nade</h3>
                                        <p className="text-gray-600">Create new grenade guides</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Edit Nade Card */}
                        <Link href="/admin/edit-nade" className="group">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-orange-100 p-3 rounded-lg">
                                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Edit Nade</h3>
                                        <p className="text-gray-600">Modify grenade guides</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-8">
                        <AdminLogoutButton />
                    </div>
                </div>
            </section>
        );
};

export default withAdminAuth(AdminPage);
