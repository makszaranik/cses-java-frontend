import React from 'react';
import logo from '../../assets/img.png';
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state";
const host = import.meta.env.VITE_BACKEND_URL;

const Navbar: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const setUser = useAuthStore(state => state.setUser);
    const navigate = useNavigate();

    const isTeacher = user?.role?.toUpperCase() === "TEACHER";
    const isAdmin = user?.role?.toUpperCase() === "ADMIN";

    const handleLogout = async () => {
        try {
            await fetch(`${host}/api/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            navigate("/");
        }
    };

    return (
        <div className="w-full bg-black shadow">
            <div className="flex justify-between items-center px-4 py-2">

                <Link to="/">
                    <img src={logo} alt="Logo" className="ml-52 h-8 cursor-pointer" />
                </Link>

                <div className="flex items-center space-x-5 mr-30">

                    {isTeacher && (
                        <>
                            <Link to="/teacher-panel" className="text-white hover:underline">
                                Teacher Panel
                            </Link>
                            <span className="text-gray-400">|</span>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <Link to="/teacher-panel" className="text-white hover:underline">
                                Teacher Panel
                            </Link>
                            <span className="text-gray-400">|</span>

                            <Link to="/admin-panel" className="text-white hover:underline">
                                Admin Panel
                            </Link>
                            <span className="text-gray-400">|</span>
                        </>
                    )}

                    {user ? (
                        <>
                            <span className="text-white">{user.username}</span>
                            <span className="text-gray-400">|</span>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-white hover:underline"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="text-white hover:underline">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;