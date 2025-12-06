import React, {useEffect, useState} from 'react';
import TabsNavigation from "../components/ui/TabsNavigation.tsx";
import type {IProblem} from "../types";
import ProblemsTable from "../components/problems/ProblemsTable.tsx";
import Navbar from "../components/ui/Navbar.tsx";
const host = import.meta.env.VITE_BACKEND_URL;

const MainPage: React.FC = () => {
    const [problems, setProblems] = useState<IProblem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch(`${host}/api/tasks`, {
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
            <Navbar/>
            <div className="text-3xl ml-60 mt-6 font-bold">CSES Список задач</div>
            <TabsNavigation options={[
                {value: 'tasks', path: '/problemset'},
            ]}/>
            {loading ? (
                <div className="ml-60 mt-4">Завантажуються задачі...</div>
            ) : (
                <ProblemsTable problems={problems}/>
            )}
        </div>
    );
};

export default MainPage;
