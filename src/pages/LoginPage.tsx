import React from 'react';
import Login from "../components/auth/Login.tsx";
import Navbar from "../components/ui/Navbar.tsx";

const LoginPage: React.FC = () => {
    return (
        <>
            <Navbar />
            <Login />
        </>
    );
};

export default LoginPage;