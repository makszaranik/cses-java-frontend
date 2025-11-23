import React, { useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface RepoDto {
    id: string;
    name: string;
}

interface GitHubFileUploadProps {
    taskId: string;
    autoLoad?: boolean;
    apiBase?: string;
}

const GitHubFileUpload: React.FC<GitHubFileUploadProps> = ({
                                                               taskId,
                                                               autoLoad = false,
                                                               apiBase = "http://localhost:8000/api"
                                                           }) => {
    const [repos, setRepos] = useState<RepoDto[]>([]);
    const [selected, setSelected] = useState<string>("");
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState<string | null>(null);

    const navigate = useNavigate();

    const alertUser = (msg: string) => {
        setAlert(msg);
        setTimeout(() => setAlert(null), 2000);
    };

    async function loadRepos() {
        if (loadingRepos) return;
        setLoadingRepos(true);

        try {
            const resp = await fetch(`${apiBase}/users/github-repos`, {
                credentials: "include"
            });
            if (!resp.ok) throw new Error();

            const data = await resp.json();
            setRepos(data);
            if (data.length > 0) setSelected(data[0].name);
        } catch {
            alertUser("Failed to load GitHub repositories.");
        } finally {
            setLoadingRepos(false);
        }
    }

    useEffect(() => {
        if (autoLoad) loadRepos();
    }, [autoLoad]);

    async function submitRepo() {
        if (!selected) {
            alertUser("Select repository first.");
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const zipResp = await fetch(
                `${apiBase}/files/github-save-zip/${selected}`,
                { method: "GET", credentials: "include" }
            );

            if (!zipResp.ok) {
                const problem = await zipResp.json().catch(() => null);

                if (zipResp.status === 403 && problem?.title === "Submission Not Allowed") {
                    alertUser(problem.detail);
                    return;
                }

                throw new Error();
            }

            const zipFile = await zipResp.json();
            const fileId = zipFile.id;

            const submitResp = await fetch(`${apiBase}/tasks/submit`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId: taskId,
                    sourceCodeFileId: fileId
                })
            });

            if (!submitResp.ok) {
                const problem = await submitResp.json().catch(() => null);

                if (submitResp.status === 403 && problem?.title === "Submission Not Allowed") {
                    alertUser(problem.detail);
                    return;
                }

                throw new Error();
            }

            const result = await submitResp.json();
            navigate(`/problemset/results/${taskId}`, {
                state: { submissionId: result.id }
            });
        } catch {
            alertUser("Submission error.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col ml-60 mt-6 gap-3">
            {alert && (
                <Alert variant="danger">
                    {alert}
                </Alert>
            )}

            <div className="flex items-center gap-3">
                <select
                    className="border border-gray-400 rounded px-2 py-1"
                    value={selected}
                    onChange={e => setSelected(e.target.value)}
                    disabled={loadingRepos}
                >
                    {loadingRepos && <option>Loading...</option>}
                    {!loadingRepos && repos.length === 0 && <option>No repositories found</option>}
                    {repos.map(r => (
                        <option key={r.id} value={r.name}>
                            {r.name}
                        </option>
                    ))}
                </select>

                <Button
                    variant="dark"
                    onClick={submitRepo}
                    disabled={isSubmitting || !selected || loadingRepos}
                >
                    {isSubmitting ? "Submitting…" : "Submit"}
                </Button>
            </div>
        </div>
    );
};

export default GitHubFileUpload;