import React, {useEffect, useState} from 'react';
import Navbar from "../components/ui/Navbar.tsx";
import {Link, useLocation, useParams} from "react-router-dom";
import TabsNavigation from "../components/ui/TabsNavigation.tsx";
import {Table, Badge, Modal, Button} from "react-bootstrap";
import type {ISubmission, SubmissionStatus} from "../types";
import type {IProblem} from "../types";
import {DownloadFileById} from "../components/problems/DownloadFileById.tsx";

const host = import.meta.env.VITE_BACKEND_URL;

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
    const {id: taskId} = useParams<{ id: string }>();
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
            const res = await fetch(`${host}/api/tasks/${taskId}`, {credentials: "include"});
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
                const res = await fetch(`${host}/api/submissions/${taskId}/history`, {
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

        const url = `${host}/api/tasks/status?submissionId=${submissionIdToTrack}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = event => {
            if (!event.data) return;

            try {
                const updated: ISubmission = JSON.parse(event.data);
                setTrackedSubmission(updated);

                setSubmissions(prev => {
                    const withoutOld = prev.filter(s => s.id !== updated.id);
                    return [updated, ...withoutOld].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                });

            } catch (err) {
                console.error("SSE parse error:", err);
            }
        };

        eventSource.onerror = err => {
            console.error("SSE error:", err);
            eventSource.close();
        };

        return () => eventSource.close();
    }, [submissionIdToTrack]);

    const taskIdText = taskId ?? "";

    return (
        <>
            <Navbar/>

            <Link
                to='/problemset'
                className="decoration-none text-2xl ml-60 mt-2 font-bold text-black no-underline"
            >
                CSES Problem Set
            </Link>

            <TabsNavigation
                options={[
                    {value: 'tasks', path: '/problemset'},
                    {value: 'submit', path: `/problemset/submit/${taskIdText}`},
                    {value: 'result', path: `/problemset/results/${taskIdText}`},
                    {value: 'statistics', path: `/problemset/statistics/${taskIdText}`}
                ]}
            />

            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl font-semibold mb-4">Results for Task {task?.title}</h2>

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
                        {submissions.map(submission => (
                            <tr key={submission.id}>
                                <td>{submission.id}</td>
                                <td><Badge bg={getBadgeVariant(submission.status)}>{submission.status}</Badge></td>
                                <td>{submission.score ?? "-"}</td>
                                <td>
                                    <Button variant="dark" size="sm" onClick={() => handleShowLogsModal(submission)}>
                                        Show
                                    </Button>
                                </td>
                                <td>
                                    <DownloadFileById
                                        buttonName="Download"
                                        fileId={submission.sourceCodeFileId}
                                    />
                                </td>
                            </tr>
                        ))}

                        {submissions.length === 0 && (
                            <tr>
                                <td>No submissions yet.</td>
                            </tr>
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
                    {trackedSubmission?.logs ? (
                        <div
                            className="p-3 bg-light border rounded"
                            style={{maxHeight: '500px', overflow: 'auto', whiteSpace: 'pre-wrap'}}
                        >
                            {["BUILD", "LINTER", "TEST"]
                                .map(stage => (
                                    <div key={stage} className="mb-4">
                                        <h5 className="fw-bold text-uppercase">{stage}</h5>
                                        <pre className="bg-white p-2 border rounded">{trackedSubmission.logs[stage]}</pre>
                                        <hr/>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <pre className="p-3 bg-light border rounded">No logs found.</pre>
                    )}
                </Modal.Body>


                <Modal.Footer>
                    <Button variant="dark" onClick={handleCloseLogsModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProblemResultsPage;