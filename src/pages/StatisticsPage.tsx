import React, { useEffect, useState } from "react";
import Navbar from "../components/ui/Navbar.tsx";
import { Link, useParams } from "react-router-dom";
import TabsNavigation from "../components/ui/TabsNavigation.tsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatisticsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`http://localhost:8000/api/users/statistics/${id}`, { credentials: "include" })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);


    const pieData = data && {
        labels: data.statuses.map((s: any) => s.status),
        datasets: [{
            data: data.statuses.map((s: any) => s.count),
            backgroundColor: ["#4caf50", "#f44336", "#ff9800", "#2196f3", "#9c27b0", "#607d8b"]
        }]

    };

    return (
        <>
            <Navbar />
            <Link to='/problemset' className="decoration-none text-2xl ml-60 mt-2 font-bold text-black no-underline">
                CSES Problem Set
            </Link>

            <TabsNavigation options={[
                { value: "tasks", path: "/problemset" },
                { value: "submit", path: `/problemset/submit/${id}` },
                { value: "result", path: `/problemset/results/${id}` },
                { value: "statistics", path: `/problemset/statistics/${id}` }
            ]} />

            <div className="max-w-3xl mx-auto pt-1 p-5">
                <h2 className="text-3xl font-semibold mb-4">Statistics for Task {id}</h2>

                {loading && <div>Loading statistics...</div>}
                {!loading && !data && <div>No statistics available.</div>}
                {pieData && <Pie data={pieData} options={{radius: "60%"}} />}
            </div>
        </>
    );
};

export default StatisticsPage;