import React, { useEffect, useState } from "react";
import Navbar from "../components/ui/Navbar.tsx";
import { Link, useParams } from "react-router-dom";
import TabsNavigation from "../components/ui/TabsNavigation.tsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import type {IProblem} from "../types";
const host = import.meta.env.VITE_BACKEND_URL;
ChartJS.register(ArcElement, Tooltip, Legend);

const StatisticsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [task, setTask] = useState<IProblem | null>(null);

    useEffect(() => {
        async function loadTask() {
            const res = await fetch(`${host}/api/tasks/${id}`, {
                credentials: "include"
            });
            const data = await res.json();
            setTask(data);
        }
        loadTask();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                const res = await fetch(
                    `${host}/api/users/statistics/${id}`,
                    { credentials: "include" }
                );

                if (!res.ok) throw new Error("Statistics fetch error");

                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);


    const statusColor = (status: string) => {
        switch (status) {
            case "ACCEPTED":
                return "#4caf30";
            case "COMPILATION_SUCCESS":
                return "#4caf70";
            case "LINTER_PASSED":
                return "#4caf90";

            case "WRONG_ANSWER":
            case "COMPILATION_ERROR":
            case "LINTER_FAILED":
                return "#f44336";
            case "OUT_OF_MEMORY_ERROR":
            case "TIME_LIMIT_EXCEEDED":
                return "#ffb300";

            case "SUBMITTED":
                return "#9e9e9e";

            default:
                return "#2196f3";
        }
    };

    const pieData = data && {
        labels: data.statuses.map((s: any) => s.status),
        datasets: [
            {
                data: data.statuses.map((s: any) => s.count),
                backgroundColor: data.statuses.map((s: any) => statusColor(s.status)),
            }
        ]
    };

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
                    { value: "tasks", path: "/problemset" },
                    { value: "submit", path: `/problemset/submit/${id}` },
                    { value: "result", path: `/problemset/results/${id}` },
                    { value: "statistics", path: `/problemset/statistics/${id}` }
                ]}
            />

            <div className="max-w-3xl mx-auto pt-1 p-5">
                <h2 className="text-3xl font-semibold mb-4">Statistics for Task {task?.title}</h2>

                {loading && <div>Loading statistics...</div>}
                {!loading && !data && <div>No statistics available.</div>}
                {pieData && <Pie data={pieData} options={{ radius: "60%" }} />}
            </div>
        </>
    );
};

export default StatisticsPage;