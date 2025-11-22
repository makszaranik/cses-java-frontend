import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import FileUpload from "../files/FileUpload.tsx";
import { SubmissionFileType } from "../../types";

const TeacherUpdateTaskForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [taskId, setTaskId] = useState("");
    const [original, setOriginal] = useState<any>(null);

    const [form, setForm] = useState({
        taskId: "",
        title: "",
        statement: "",
        memoryRestriction: 1,
        solutionTemplateFileId: "",
        testsFileId: "",
        lintersFileId: "",
        testsPoints: 0,
        lintersPoints: 0,
        submissionsNumberLimit: 1
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const setField = (name: string, value: any) => {
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    useEffect(() => {
        fetch("http://localhost:8000/api/tasks", { credentials: "include" })
            .then(r => r.json())
            .then(setTasks)
            .catch(() => alert("Error loading tasks"));
    }, []);

    async function loadTask(id: string) {
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
                solutionTemplateFileId: data.solutionTemplateFileId,
                testsFileId: data.testsFileId,
                lintersFileId: data.lintersFileId,
                testsPoints: data.testsPoints,
                lintersPoints: data.lintersPoints,
                submissionsNumberLimit: data.submissionsNumberLimit
            });

            setErrors({});
        } catch {
            alert("Error loading task");
        }
    }

    function validate() {
        const e: any = {};
        const f = form;

        if (!f.title.trim()) e.title = "Required";
        if (!f.statement.trim()) e.statement = "Required";

        if (f.memoryRestriction < 0 || f.memoryRestriction > 512)
            e.memoryRestriction = "0–512";

        if (f.testsPoints < 0 || f.testsPoints > 100)
            e.testsPoints = "0–100";

        if (f.lintersPoints < 0 || f.lintersPoints > 100)
            e.lintersPoints = "0–100";

        if (f.testsPoints + f.lintersPoints !== 100) {
            e.testsPoints = "Sum must be 100";
            e.lintersPoints = "Sum must be 100";
        }

        if (f.submissionsNumberLimit < 1)
            e.submissionsNumberLimit = "Must be ≥ 1";

        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!taskId) return;

        if (!validate()) return;

        const payload = {
            ...form,
            solutionTemplateFileId:
                form.solutionTemplateFileId || original?.solutionTemplateFileId,
            testsFileId:
                form.testsFileId || original?.testsFileId,
            lintersFileId:
                form.lintersFileId || original?.lintersFileId
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
            alert("Error updating task");
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
                    <Form.Select
                        value={taskId}
                        onChange={e => {
                            const id = e.target.value;
                            setTaskId(id);
                            if (id) loadTask(id);
                        }}
                    >
                        <option value="">-- Select task --</option>
                        {tasks.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.id} — {t.title}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        name="title"
                        value={form.title}
                        onChange={e => setField("title", e.target.value)}
                        isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Statement</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="statement"
                        value={form.statement}
                        onChange={e => setField("statement", e.target.value)}
                        isInvalid={!!errors.statement}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.statement}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Memory Restriction</Form.Label>
                    <Form.Control
                        type="number"
                        name="memoryRestriction"
                        value={form.memoryRestriction}
                        onChange={e => setField("memoryRestriction", Number(e.target.value))}
                        isInvalid={!!errors.memoryRestriction}
                        min={0}
                        max={512}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.memoryRestriction}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Tests Points</Form.Label>
                    <Form.Control
                        type="number"
                        name="testsPoints"
                        value={form.testsPoints}
                        onChange={e => setField("testsPoints", Number(e.target.value))}
                        isInvalid={!!errors.testsPoints}
                        min={0}
                        max={100}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.testsPoints}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Linters Points</Form.Label>
                    <Form.Control
                        type="number"
                        name="lintersPoints"
                        value={form.lintersPoints}
                        onChange={e => setField("lintersPoints", Number(e.target.value))}
                        isInvalid={!!errors.lintersPoints}
                        min={0}
                        max={100}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.lintersPoints}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Submissions Limit</Form.Label>
                    <Form.Control
                        type="number"
                        name="submissionsNumberLimit"
                        value={form.submissionsNumberLimit}
                        onChange={e => setField("submissionsNumberLimit", Number(e.target.value))}
                        isInvalid={!!errors.submissionsNumberLimit}
                        min={1}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.submissionsNumberLimit}
                    </Form.Control.Feedback>
                </Form.Group>

                <h6 className="mt-3">Replace files (optional)</h6>

                <FileUpload
                    fileType={SubmissionFileType.SOLUTION}
                    buttonText="Replace solution"
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