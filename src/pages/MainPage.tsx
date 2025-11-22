import React, { useEffect, useState } from 'react';
import TabsNavigation from "../components/TabsNavigation.tsx";
import type IProblem from "../types";
import ProblemsTable from "../components/problems/ProblemsTable.tsx";
import Navbar from "../components/ui/Navbar.tsx";

const MainPage: React.FC = () => {
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

    return (
        <div>
            <Navbar />
            <div className="text-3xl ml-60 mt-6 font-bold">CSES Problem Set</div>
            <TabsNavigation options={[
                { value: 'tasks', path: '/problemset' },
                { value: 'stats', path: '/stats' }
            ]} />
            {loading ? (
                <div className="ml-60 mt-4">Loading problems...</div>
            ) : (
                <ProblemsTable problems={problems} />
            )}
        </div>
    );
};

export default MainPage;
