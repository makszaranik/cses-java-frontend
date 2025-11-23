import React, {useEffect, useState} from 'react';
import ProblemsTable from "../components/problems/ProblemsTable.tsx";
import type { IProblem } from "../types";
import Navbar from "../components/ui/Navbar.tsx";

const ProblemsetPage: React.FC = () => {
    const [problems, setProblems] = useState<IProblem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/tasks", {
                    credentials: "include"
                });
                if (!response.ok) {
                    throw new Error("Failed to load problems");
                }
                const data = await response.json();
                setProblems(data);
            } catch (error) {
                console.error("Error loading problems:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    if (loading) {
        return <div className="ml-60 mt-4">Loading problems...</div>;
    }

    return (
        <>
            <Navbar />
            <ProblemsTable problems={problems}/>
        </>
    );
};

export default ProblemsetPage;
