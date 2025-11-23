import React from 'react';
import { Routes, Route } from "react-router";
import { privateRoutes, publicRoutes } from "../router";
import { useAuthStore } from "../state";
import LoginPage from "../pages/LoginPage.tsx";

const AppRouter: React.FC = () => {

    const user = useAuthStore(state => state.user);

    return (
        <Routes>
            {publicRoutes.map(route => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {user &&
                privateRoutes.map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))
            }
            <Route path="*" element={<LoginPage />} />
        </Routes>
    );
};

export default AppRouter;