import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const TeacherDeleteTaskForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [tasks, setTasks] = useState<Array<any>>([]);
    const [taskId, setTaskId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await fetch("http://localhost:8000/api/tasks", {
                    credentials: "include"
                });

                if (!res.ok) throw new Error("Failed to load tasks");
                const data = await res.json();
                setTasks(data);
            } catch (e) {
                console.error(e);
                alert("Error loading task list");
            }
        }

        fetchTasks();
    }, []);

    async function handleDelete() {
        if (!taskId) {
            setError("Please select a task");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:8000/api/tasks/delete", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ taskId })
            });

            if (!res.ok) throw new Error("Delete failed");

            onSuccess();
            setTaskId("");
        } catch (error) {
            console.error("Error while deleting task:", error);
            alert("Error while deleting task");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="border p-4 rounded shadow-sm mt-5">
            <h4>Delete Task</h4>
            <Form>
                <Form.Group className="mt-2">
                    <Form.Label>Select Task</Form.Label>
                    <Form.Select
                        value={taskId}
                        isInvalid={!!error}
                        onChange={e => {
                            setTaskId(e.target.value);
                            setError(null);
                        }}
                    >
                        <option value="">-- Select task --</option>
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
                        {loading ? "Deleting..." : "Delete Task"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default TeacherDeleteTaskForm;