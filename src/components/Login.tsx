import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAuthStore } from "../state";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user);
    const setUser = useAuthStore(s => s.setUser);

    useEffect(() => {
        fetch("http://localhost:8000/api/users/me", { credentials: "include" })
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
        window.location.href =
            "http://localhost:8000/api/oauth2/authorization/github";
    };

    return (
        <div className="mt-8 ml-55 font-bold text-3xl">
            {user ? (
                <>You are already logged in as {user.username}.</>
            ) : (
                <>
                    <div>Login</div>
                    <Button
                        onClick={handleLogin}
                        className="mt-4 w-48 bg-gray-200 text-black py-1 rounded border"
                        variant="light"
                    >
                        Login with GitHub
                    </Button>
                </>
            )}
        </div>
    );
};

export default Login;
