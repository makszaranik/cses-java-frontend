import { useEffect } from "react";
import { useAuthStore } from "../state";

const AuthBootstrap = () => {
    const user = useAuthStore(s => s.user);
    const setUser = useAuthStore(s => s.setUser);

    useEffect(() => {
        if (user) return;

        fetch("http://localhost:8000/api/users/me", { credentials: "include" })
            .then(r => (r.ok ? r.json() : null))
            .then(data => {
                if (data) {
                    setUser(data);
                }
            })
            .catch(console.error);
    }, [user, setUser]);

    return null;
};

export default AuthBootstrap;
