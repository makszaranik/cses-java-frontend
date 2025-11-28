import { useEffect } from "react";
import { useAuthStore } from "../../state";
const host = import.meta.env.VITE_BACKEND_URL;

const AuthBootstrap = () => {
    const user = useAuthStore(s => s.user);
    const setUser = useAuthStore(s => s.setUser);

    useEffect(() => {
        if (user) return;

        fetch(`${host}/api/users/me`, { credentials: "include" })
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
