import React, { useEffect, useState } from "react";
import Navbar from "../components/ui/Navbar.tsx";
import { Button, Table } from "react-bootstrap";

interface IUser {
    id: string;
    username: string;
    role: string;
}

const AdminPanelPage: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/users", {
                credentials: "include"
            });
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error("Error loading users", e);
            alert("Error loading users");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const grantTeacher = async (userId: string) => {
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:8000/api/users/${userId}/grant-teacher`, {
                method: "POST",
                credentials: "include"
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.detail || "Unknown error");
            }

            alert("Role updated successfully");
            await loadUsers();

        } catch (e: any) {
            console.error("Error granting role", e);
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="p-4">
                <h3 className="mb-3">Admin Panel</h3>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Grant Teacher</th>
                    </tr>
                    </thead>

                    <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    disabled={loading || user.role === "TEACHER" || user.role === "ADMIN"}
                                    onClick={() => grantTeacher(user.id)}
                                >
                                    Grant teacher
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default AdminPanelPage;