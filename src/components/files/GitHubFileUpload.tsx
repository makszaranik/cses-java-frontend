import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
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
    const navigate = useNavigate();

    async function loadRepos() {
        if (loadingRepos) return;
        setLoadingRepos(true);

        try {
            const resp = await fetch(`${apiBase}/users/github-repos`, {
                credentials: "include"
            });
            if (!resp.ok) throw new Error("Failed to load repos");

            const data = await resp.json();
            setRepos(data);
            if (data.length > 0) setSelected(data[0].name);
        } finally {
            setLoadingRepos(false);
        }
    }

    useEffect(() => {
        if (autoLoad) loadRepos();
    }, [autoLoad]);

    async function submitRepo() {
        if (!selected) {
            alert("Select repository first");
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const zipResp = await fetch(
                `${apiBase}/files/github-save-zip/${selected}`,
                { method: "GET", credentials: "include" }
            );

            if (!zipResp.ok) throw new Error("Failed to save repo zip");
            const zipFile = await zipResp.json();
            const fileId = zipFile.id;

            const submitResp = await fetch(`${apiBase}/tasks/submit`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    taskId: taskId,
                    sourceCodeFileId: fileId
                })
            });

            if (!submitResp.ok) throw new Error("Submission failed");

            const result = await submitResp.json();
            navigate(`/problemset/results/${taskId}`, {
                state: { submissionId: result.id }
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex ml-60 mt-6 items-center gap-3">
            <select
                className="border border-gray-400 rounded px-2 py-1"
                value={selected}
                onChange={e => setSelected(e.target.value)}
                disabled={loadingRepos}
            >
                {loadingRepos && <option>Loading...</option>}
                {!loadingRepos && repos.length === 0 && (
                    <option>No repositories found</option>
                )}
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
    );
};

export default GitHubFileUpload;