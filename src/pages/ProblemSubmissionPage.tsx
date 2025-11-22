import React, { useState } from 'react';
import Navbar from "../components/ui/Navbar.tsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import TabsNavigation from "../components/TabsNavigation.tsx";
import { useAuthStore } from "../state";
import { SubmissionFileType } from "../types";
import FileUpload from "../components/files/FileUpload.tsx";
import GitHubFileUpload from "../components/files/GitHubFileUpload.tsx";

const ProblemSubmissionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();
    const taskId = id ?? "";

    const [mode, setMode] = useState<"FILE" | "REPO">("FILE");
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

    async function handleSubmitSolution() {
        if (!uploadedFileId) {
            alert("Please upload file first");
            return;
        }

        try {
            const body = JSON.stringify({
                taskId,
                sourceCodeFileId: uploadedFileId
            });

            const res = await fetch("http://localhost:8000/api/tasks/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body
            });

            if (!res.ok) throw new Error("Submission failed");

            const data = await res.json();
            const submissionId = data.id;

            navigate(`/problemset/results/${taskId}`, { state: { submissionId } });
        } catch (err) {
            console.error(err);
            alert("Submission error");
        }
    }

    return (
        <>
            <Navbar />

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

                        <label>
                            <input
                                type="radio"
                                className="mr-1"
                                checked={mode === "REPO"}
                                onChange={() => setMode("REPO")}
                            />
                            Select repository
                        </label>
                    </div>

                    {mode === "FILE" && (
                        <FileUpload
                            fileType={SubmissionFileType.SOLUTION}
                            onFileUploaded={setUploadedFileId}
                        />
                    )}

                    {uploadedFileId && mode === "FILE" && (
                        <button
                            className="ml-60 mt-4 bg-black text-white px-4 py-2 rounded"
                            onClick={handleSubmitSolution}
                        >
                            Submit solution
                        </button>
                    )}

                    {mode === "REPO" && (
                        <GitHubFileUpload taskId={taskId} autoLoad={true} />
                    )}
                </>
            )}
        </>
    );
};

export default ProblemSubmissionPage;