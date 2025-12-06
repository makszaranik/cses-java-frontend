import React, {useEffect, useState} from 'react';
import Problem from "../components/problems/Problem.tsx";
import Navbar from "../components/ui/Navbar.tsx";
import type {IProblem} from "../types";
import TabsNavigation from "../components/ui/TabsNavigation.tsx";
import {Link, useParams} from "react-router-dom";
const host = import.meta.env.VITE_BACKEND_URL;

const ProblemPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [problem, setProblem] = useState<IProblem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchProblem = async () => {
            try {
                const response = await fetch(`${host}/api/tasks/${id}`, {
                    credentials: "include"
                });
                if (!response.ok) throw new Error("Failed to load problem");
                const data = await response.json();
                setProblem(data);
            } catch (error) {
                console.error("Error loading problem:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id]);

    if (!id) {
        return <div className="ml-60 mt-4 text-red-600">Неправильнинй task id</div>;
    }

    if (loading || !problem) {
        return <div className="ml-60 mt-4">Loading...</div>;
    }

    return (
        <>
            <Navbar/>

            <Link
                to='/problemset'
                className="decoration-none text-2xl ml-60 mt-2 font-bold text-black no-underline"
            >
                CSES Список задач
            </Link>

            <TabsNavigation
                options={[
                    {value: 'tasks', path: '/problemset'},
                    {value: 'submit', path: `/problemset/submit/${problem.id}`},
                    {value: 'result', path: `/problemset/results/${problem.id}`},
                    {value: 'statistics', path: `/problemset/statistics/${problem.id}`}
                ]}
            />

            <div className="max-w-3xl mx-auto p-6">
                <Problem
                    title={problem.title}
                    statement={problem.statement}
                    timeRestriction={problem.timeRestriction}
                    memoryRestriction={problem.memoryRestriction}
                    submissionsNumberLimit={problem.submissionsNumberLimit}
                />
            </div>
        </>
    );
};

export default ProblemPage;
