import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from "./components/AppRouter.tsx";
import AuthBootstrap from "./components/auth/AuthBootstrap.tsx";

const App: React.FC = () => {
    return (
        <>
            <AuthBootstrap />
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </>
    );
};

export default App;