import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
const host = import.meta.env.VITE_BACKEND_URL;

const TeacherDeleteTaskForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [tasks, setTasks] = useState<Array<any>>([]);
    const [taskId, setTaskId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await fetch(`${host}/api/tasks/owned`, {
                    credentials: "include"
                });

                if (!res.ok) throw new Error("Не вдалося завантажити список завдань");
                const data = await res.json();
                setTasks(data);
            } catch (e) {
                console.error(e);
                alert("Помилка під час завантаження списку завдань");
            }
        }

        fetchTasks();
    }, []);

    async function handleDelete() {
        if (!taskId) {
            setError("Оберіть завдання");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${host}/api/tasks/delete`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ taskId })
            });

            if (!res.ok) throw new Error("Не вдалося видалити завдання");

            onSuccess();
            setTaskId("");
        } catch (error) {
            console.error("Error while deleting task:", error);
            alert("Помилка під час видалення завдання");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="border p-4 rounded shadow-sm mt-5">
            <h4>Видалити завдання</h4>
            <Form>
                <Form.Group className="mt-2">
                    <Form.Label>Оберіть завдання</Form.Label>
                    <Form.Select
                        value={taskId}
                        isInvalid={!!error}
                        onChange={e => {
                            setTaskId(e.target.value);
                            setError(null);
                        }}
                    >
                        <option value="">-- Оберіть завдання --</option>
                        {tasks.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.id} — {t.title}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="mt-4">
                    <Button variant="danger" disabled={loading} onClick={handleDelete}>
                        {loading ? "Видалення..." : "Видалити завдання"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default TeacherDeleteTaskForm;