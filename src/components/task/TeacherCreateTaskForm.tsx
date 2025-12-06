import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import FileUpload from "../files/FileUpload.tsx";
import { SubmissionFileType } from "../../types";
const host = import.meta.env.VITE_BACKEND_URL;

const TeacherCreateTaskForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [form, setForm] = useState({
        title: "",
        statement: "",
        memoryRestriction: 256,
        solutionTemplateFileId: "",
        testsFileId: "",
        lintersFileId: "",
        testsPoints: 50,
        lintersPoints: 50,
        submissionsNumberLimit: 3
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const setField = (name: string, value: any) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const e: any = {};

        if (!form.title.trim()) e.title = "Обов’язково";
        if (!form.statement.trim()) e.statement = "Обов’язково";

        if (form.memoryRestriction < 6 || form.memoryRestriction > 512)
            e.memoryRestriction = "6–512";

        if (!form.solutionTemplateFileId) e.solutionTemplateFileId = "Обов’язково";
        if (!form.testsFileId) e.testsFileId = "Обов’язково";
        if (!form.lintersFileId) e.lintersFileId = "Обов’язково";

        if (form.testsPoints < 0 || form.testsPoints > 100)
            e.testsPoints = "0–100";

        if (form.lintersPoints < 0 || form.lintersPoints > 100)
            e.lintersPoints = "0–100";

        if (form.submissionsNumberLimit < 1)
            e.submissionsNumberLimit = "Має бути ≥ 1";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    async function handleSubmit() {
        if (!validate()) return;

        setLoading(true);

        try {
            const res = await fetch(`${host}/api/tasks/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error();

            alert("Завдання створено!");
            onSuccess();
        } catch {
            alert("Помилка!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="border p-4 rounded shadow-sm">
            <h4>Створити завдання</h4>

            <Form>
                <Form.Group className="mt-2">
                    <Form.Label>Назва</Form.Label>
                    <Form.Control
                        name="title"
                        value={form.title}
                        isInvalid={!!errors.title}
                        onChange={e => setField("title", e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Умова</Form.Label>
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
                    <Form.Label>Обмеження пам’яті</Form.Label>
                    <Form.Control
                        type="number"
                        name="memoryRestriction"
                        value={form.memoryRestriction}
                        isInvalid={!!errors.memoryRestriction}
                        onChange={e => setField("memoryRestriction", Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">{errors.memoryRestriction}</Form.Control.Feedback>
                </Form.Group>

                <h6 className="mt-3">Файл шаблону розв’язку</h6>
                <FileUpload
                    fileType={SubmissionFileType.SOLUTION_TEMPLATE}
                    buttonText="Завантажити шаблон розв’язку"
                    onFileUploaded={id => setField("solutionTemplateFileId", id)}
                />
                {errors.solutionTemplateFileId && (
                    <div className="text-danger">{errors.solutionTemplateFileId}</div>
                )}

                <h6 className="mt-3">Файл тестів</h6>
                <FileUpload
                    fileType={SubmissionFileType.TEST}
                    buttonText="Завантажити тести"
                    onFileUploaded={id => setField("testsFileId", id)}
                />
                {errors.testsFileId && (
                    <div className="text-danger">{errors.testsFileId}</div>
                )}

                <h6 className="mt-3">Файл лінтерів</h6>
                <FileUpload
                    fileType={SubmissionFileType.LINTER}
                    buttonText="Завантажити лінтери"
                    onFileUploaded={id => setField("lintersFileId", id)}
                />
                {errors.lintersFileId && (
                    <div className="text-danger">{errors.lintersFileId}</div>
                )}

                <Form.Group className="mt-3">
                    <Form.Label>Бали за тести</Form.Label>
                    <Form.Control
                        type="number"
                        name="testsPoints"
                        value={form.testsPoints}
                        isInvalid={!!errors.testsPoints}
                        onChange={e => setField("testsPoints", Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">{errors.testsPoints}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label>Бали за лінтери</Form.Label>
                    <Form.Control
                        type="number"
                        name="lintersPoints"
                        value={form.lintersPoints}
                        isInvalid={!!errors.lintersPoints}
                        onChange={e => setField("lintersPoints", Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">{errors.lintersPoints}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label>Ліміт спроб</Form.Label>
                    <Form.Control
                        type="number"
                        name="submissionsNumberLimit"
                        value={form.submissionsNumberLimit}
                        isInvalid={!!errors.submissionsNumberLimit}
                        onChange={e => setField("submissionsNumberLimit", Number(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">{errors.submissionsNumberLimit}</Form.Control.Feedback>
                </Form.Group>

                <div className="mt-4">
                    <Button variant="success" disabled={loading} onClick={handleSubmit}>
                        {loading ? "Створення..." : "Створити завдання"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default TeacherCreateTaskForm;