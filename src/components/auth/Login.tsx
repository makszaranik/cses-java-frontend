import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAuthStore } from "../../state";
import { useNavigate } from "react-router-dom";
const host = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user);
    const setUser = useAuthStore(s => s.setUser);

    useEffect(() => {
        fetch(`${host}/api/users/me`, { credentials: "include" })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data) {
                    setUser(data);
                    navigate("/");
                }
            })
            .catch(console.error);
    }, []);

    const handleLogin = () => {
        window.location.href = `${host}/api/oauth2/authorization/github`;
    };

    return (
        <div className="mt-8 ml-55 font-bold text-3xl">
            {user ? (
                <> Ви вже аторизовані як {user.username}.</>
            ) : (
                <>
                    <div>Логін</div>
                    <Button
                        onClick={handleLogin}
                        className="mt-4 w-48 bg-gray-200 text-black py-1 rounded border"
                        variant="light"
                    >
                        Логін через GitHub
                    </Button>
                </>
            )}
        </div>
    );
};

export default Login;
