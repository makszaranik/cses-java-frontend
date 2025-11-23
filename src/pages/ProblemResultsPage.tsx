import React, { useEffect, useState } from 'react';
import Navbar from "../components/ui/Navbar.tsx";
import { Link, useLocation, useParams } from "react-router-dom";
import TabsNavigation from "../components/ui/TabsNavigation.tsx";
import { Table, Badge, Modal, Button } from "react-bootstrap";
import type { ISubmission, SubmissionStatus } from "../types";
import type { IProblem } from "../types";
import {DownloadSolutionTemplate} from "../components/problems/DownloadSolutionTemplate.tsx";

const getBadgeVariant = (status: SubmissionStatus): string => {
    switch (status) {
        case "ACCEPTED":
        case "COMPILATION_SUCCESS":
        case "LINTER_PASSED":
            return "success";
        case "COMPILATION_ERROR":
        case "WRONG_ANSWER":
        case "TIME_LIMIT_EXCEEDED":
        case "OUT_OF_MEMORY_ERROR":
        case "LINTER_FAILED":
            return "danger";
        case "SUBMITTED":
            return "secondary";
        default:
            return "dark";
    }
};

const ProblemResultsPage: React.FC = () => {
    const { id: taskId } = useParams<{ id: string }>();
    const location = useLocation();
    const submissionIdToTrack = (location.state as any)?.submissionId;
    const [task, setTask] = useState<IProblem | null>(null);
    const [submissions, setSubmissions] = useState<ISubmission[]>([]);
    const [trackedSubmission, setTrackedSubmission] = useState<ISubmission | null>(null);
    const [showLogsModal, setShowLogsModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleShowLogsModal = (submission: ISubmission) => {
        setTrackedSubmission(submission);
        setShowLogsModal(true);
    };

    useEffect(() => {
        async function loadTask() {
            const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
                credentials: "include"
            });
            const data = await res.json();
            setTask(data);
        }
        loadTask();
    }, [taskId]);

    const handleCloseLogsModal = () => setShowLogsModal(false);

    useEffect(() => {
        if (!taskId) return;

        const load = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/submissions/${taskId}/history`, {
                    credentials: "include"
                });

                const data: ISubmission[] = await res.json();

                setSubmissions(
                    data.sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                );
            } catch (e) {
                console.error("History load error:", e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [taskId]);

    useEffect(() => {
        if (!submissionIdToTrack) return;

        const eventSource = new EventSource(
            `http://localhost:8000/api/tasks/status?submissionId=${submissionIdToTrack}`,
            { withCredentials: true }
        );

        eventSource.onmessage = (event) => {
            try {
                const updated: ISubmission = JSON.parse(event.data);
                setTrackedSubmission(updated);

                setSubmissions((prev) => {
                    const existing = prev.filter(s => s.id !== updated.id);
                    return [updated, ...existing].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                });
            } catch (e) {
                console.error("SSE parse error:", e);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            eventSource.close();
        };

        return () => eventSource.close();
    }, [submissionIdToTrack]);

    const taskIdText = taskId ?? "";

    return (
        <>
            <Navbar />

            <Link
                to='/problemset'
                className="decoration-none text-2xl ml-60 mt-2 font-bold text-black no-underline"
            >
                CSES Problem Set
            </Link>

            <TabsNavigation
                options={[
                    { value: 'tasks', path: '/problemset' },
                    { value: 'submit', path: `/problemset/submit/${taskIdText}` },
                    { value: 'result', path: `/problemset/results/${taskIdText}` },
                    { value: 'statistics', path: `/problemset/statistics/${taskIdText}` }
                ]}
            />

            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl font-semibold mb-4">Results for Task {taskIdText}</h2>

                {loading ? (
                    <div>Loading submissions...</div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>Submission ID</th>
                            <th>Status</th>
                            <th>Score</th>
                            <th>Logs</th>
                            <th>Solution</th>
                        </tr>
                        </thead>
                        <tbody>
                        {submissions.map(sub => (
                            <tr key={sub.id}>
                                <td>{sub.id}</td>
                                <td><Badge bg={getBadgeVariant(sub.status)}>{sub.status}</Badge></td>
                                <td>{sub.score ?? "-"}</td>
                                <td>
                                    <Button variant="dark" size="sm" onClick={() => handleShowLogsModal(sub)}>
                                        Show
                                    </Button>
                                </td>
                                <td>
                                    <DownloadSolutionTemplate solutionTemplateFileId={task?.solutionTemplateFileId}/>
                                </td>
                            </tr>
                        ))}
                        {submissions.length === 0 && (
                            <tr><td colSpan={4}>No submissions yet.</td></tr>
                        )}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showLogsModal} onHide={handleCloseLogsModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Execution Logs {trackedSubmission?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
          <pre className="p-3 bg-light border rounded" style={{ maxHeight: '500px', overflow: 'auto' }}>
            {trackedSubmission?.logs || "No logs found."}
          </pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleCloseLogsModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProblemResultsPage;