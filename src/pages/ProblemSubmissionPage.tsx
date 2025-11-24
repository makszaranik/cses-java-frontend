import React, {useEffect, useState} from 'react';
import Navbar from "../components/ui/Navbar.tsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import TabsNavigation from "../components/ui/TabsNavigation.tsx";
import { useAuthStore } from "../state";
import { SubmissionFileType } from "../types";
import type { IProblem } from "../types";
import FileUpload from "../components/files/FileUpload.tsx";
import GitHubFileUpload from "../components/files/GitHubFileUpload.tsx";
import { Alert, Button } from "react-bootstrap";
import {DownloadFileById} from "../components/problems/DownloadFileById.tsx";
const host = import.meta.env.VITE_BACKEND_URL;

const ProblemSubmissionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();
    const taskId = id ?? "";
    const [task, setTask] = useState<IProblem | null>(null);
    const [mode, setMode] = useState<"FILE" | "REPO" | "TEMPLATE">("FILE");
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

    const [alert, setAlert] = useState<string | null>(null);
    const alertUser = (msg: string) => {
        setAlert(msg);
        setTimeout(() => setAlert(null), 2000);
    };

    useEffect(() => {
        async function loadTask() {
            const res = await fetch(`${host}/api/tasks/${taskId}`, {
                credentials: "include"
            });
            const data = await res.json();
            setTask(data);
        }
        loadTask();
    }, [taskId]);

    async function handleSubmitSolution() {
        if (!uploadedFileId) {
            alertUser("Please upload file first.");
            return;
        }

        try {
            const body = JSON.stringify({
                taskId,
                sourceCodeFileId: uploadedFileId
            });

            const res = await fetch(`${host}/api/tasks/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body
            });

            if (!res.ok) {
                const problem = await res.json().catch(() => null);

                if (res.status === 403 && problem?.title === "Submission Not Allowed") {
                    alertUser(problem.detail);
                    return;
                }

                alertUser("Submission error.");
                return;
            }

            const data = await res.json();
            navigate(`/problemset/results/${taskId}`, { state: { submissionId: data.id } });

        } catch {
            alertUser("Submission error.");
        }
    }

    return (
        <>
            <Navbar />

            {alert && (
                <Alert variant="danger" className="m-3">
                    {alert}
                </Alert>
            )}

            <Link
                to="/problemset"
                className="decoration-none text-2xl ml-60 mt-2 font-bold text-black no-underline"
            >
                CSES Problem Set
            </Link>

            <TabsNavigation
                options={[
                    { value: 'tasks', path: '/problemset' },
                    { value: 'submit', path: `/problemset/submit/${taskId}` },
                    { value: 'result', path: `/problemset/results/${taskId}` },
                    { value: 'statistics', path: `/problemset/statistics/${taskId}` }
                ]}
            />

            {!user ? (
                <div className="ml-60 mt-10 text-xl text-red-600 font-semibold">
                    Login to system to upload solution
                </div>
            ) : (
                <>
                    <div className="ml-60 mt-6 mb-4">
                        <label className="mr-4">
                            <input
                                type="radio"
                                className="mr-1"
                                checked={mode === "FILE"}
                                onChange={() => setMode("FILE")}
                            />
                            Upload file
                        </label>

                        <label className="mr-4">
                            <input
                                type="radio"
                                className="mr-1"
                                checked={mode === "REPO"}
                                onChange={() => setMode("REPO")}
                            />
                            Select repository
                        </label>

                        <label>
                            <input
                                type="radio"
                                className="mr-1"
                                checked={mode === "TEMPLATE"}
                                onChange={() => setMode("TEMPLATE")}
                            />
                            Download solution template
                        </label>
                    </div>

                    {mode === "FILE" && (
                        <FileUpload
                            fileType={SubmissionFileType.SOLUTION}
                            onFileUploaded={setUploadedFileId}
                        />
                    )}

                    {mode === "FILE" && (
                        <div className="ml-60 mt-4 flex">
                            <Button
                                disabled={!uploadedFileId}
                                variant="dark"
                                className="text-white px-4 py-2 rounded"
                                onClick={handleSubmitSolution}
                            >
                                Submit solution
                            </Button>
                        </div>
                    )}

                    {mode === "REPO" && (
                        <GitHubFileUpload taskId={taskId} autoLoad={true} />
                    )}

                    <div className="ml-60">
                        {mode === "TEMPLATE" && (
                            <DownloadFileById fileId={task?.solutionTemplateFileId}/>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default ProblemSubmissionPage;