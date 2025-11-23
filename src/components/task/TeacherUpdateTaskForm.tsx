import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import FileUpload from "../files/FileUpload.tsx";
import { SubmissionFileType } from "../../types";

const TeacherUpdateTaskForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [original, setOriginal] = useState<any>(null);

    const [form, setForm] = useState({
        taskId: "",
        title: "",
        statement: "",
        memoryRestriction: 0,
        solutionTemplateFileId: "",
        testsFileId: "",
        lintersFileId: "",
        testsPoints: 0,
        lintersPoints: 0,
        submissionsNumberLimit: 0
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const setField = (name: string, value: any) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const e: any = {};

        if (!form.title.trim()) e.title = "Required";
        if (!form.statement.trim()) e.statement = "Required";

        if (form.memoryRestriction < 6 || form.memoryRestriction > 512)
            e.memoryRestriction = "6–512";

        if (form.testsPoints < 0 || form.testsPoints > 100)
            e.testsPoints = "0–100";

        if (form.lintersPoints < 0 || form.lintersPoints > 100)
            e.lintersPoints = "0–100";

        if (form.submissionsNumberLimit < 1)
            e.submissionsNumberLimit = "Must be ≥ 1";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    useEffect(() => {
        fetch("http://localhost:8000/api/tasks/owned", { credentials: "include" })
            .then(r => r.json())
            .then(setTasks)
            .catch(() => alert("Error loading tasks"));
    }, []);

    const load = async (id: string) => {
        try {
            const r = await fetch(`http://localhost:8000/api/tasks/${id}`, {
                credentials: "include"
            });
            const data = await r.json();
            setOriginal(data);

            setForm({
                taskId: data.id,
                title: data.title,
                statement: data.statement,
                memoryRestriction: data.memoryRestriction,
                solutionTemplateFileId: "",
                testsFileId: "",
                lintersFileId: "",
                testsPoints: data.testsPoints,
                lintersPoints: data.lintersPoints,
                submissionsNumberLimit: data.submissionsNumberLimit
            });

        } catch {
            alert("Error loading task");
        }
    };

    async function handleSubmit() {
        if (!validate()) return;

        const payload = {
            ...form,
            solutionTemplateFileId: form.solutionTemplateFileId || original.solutionTemplateFileId,
            testsFileId: form.testsFileId || original.testsFileId,
            lintersFileId: form.lintersFileId || original.lintersFileId
        };

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/tasks/update", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error();

            onSuccess();
        } catch {
            alert("Error updating");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="border p-4 rounded mt-5">
            <h4>Update Task</h4>

            <Form>
                <Form.Group className="mt-2">
                    <Form.Label>Select Task</Form.Label>
                    <Form.Select onChange={event => load(event.target.value)}>
                        <option value="">-- select task --</option>
                        {tasks.map(task => (
                            <option key={task.id} value={task.id}>
                                {task.id} — {task.title}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        name="title"
                        value={form.title}
                        isInvalid={!!errors.title}
                        onChange={e => setField("title", e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Statement</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="statement"
                        value={form.statement}
                        isInvalid={!!errors.statement}
                        onChange={e => setField("statement", e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.statement}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Memory Restriction</Form.Label>
                    <Form.Control
                        type="number"
                        name="memoryRestriction"
                        value={form.memoryRestriction}
                        isInvalid={!!errors.memoryRestriction}
                        onChange={e => setField("memoryRestriction", Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">{errors.memoryRestriction}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Tests Points</Form.Label>
                    <Form.Control
                        type="number"
                        name="testsPoints"
                        value={form.testsPoints}
                        isInvalid={!!errors.testsPoints}
                        onChange={e => setField("testsPoints", Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">{errors.testsPoints}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Linters Points</Form.Label>
                    <Form.Control
                        type="number"
                        name="lintersPoints"
                        value={form.lintersPoints}
                        isInvalid={!!errors.lintersPoints}
                        onChange={e => setField("lintersPoints", Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">{errors.lintersPoints}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Submissions Limit</Form.Label>
                    <Form.Control
                        type="number"
                        name="submissionsNumberLimit"
                        value={form.submissionsNumberLimit}
                        isInvalid={!!errors.submissionsNumberLimit}
                        onChange={e => setField("submissionsNumberLimit", Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">{errors.submissionsNumberLimit}</Form.Control.Feedback>
                </Form.Group>

                <h6 className="mt-3">Replace files (optional)</h6>

                <FileUpload
                    fileType={SubmissionFileType.SOLUTION_TEMPLATE}
                    buttonText="Replace solution template"
                    onFileUploaded={id => setField("solutionTemplateFileId", id)}
                />

                <FileUpload
                    fileType={SubmissionFileType.TEST}
                    buttonText="Replace tests"
                    onFileUploaded={id => setField("testsFileId", id)}
                />

                <FileUpload
                    fileType={SubmissionFileType.LINTER}
                    buttonText="Replace linters"
                    onFileUploaded={id => setField("lintersFileId", id)}
                />

                <div className="mt-4">
                    <Button variant="warning" disabled={loading} onClick={handleSubmit}>
                        {loading ? "Updating..." : "Update Task"}
                    </Button>
                </div>

            </Form>
        </div>
    );
};

export default TeacherUpdateTaskForm;