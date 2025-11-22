import { useState } from "react";
import TeacherCreateTaskForm from "../components/task/TeacherCreateTaskForm.tsx";
import { Alert, Tab, Tabs } from "react-bootstrap";
import TeacherDeleteTaskForm from "../components/task/TeacherDeleteTaskForm.tsx";
import TeacherUpdateTaskForm from "../components/task/TeacherUpdateTaskForm.tsx";
import Navbar from "../components/ui/Navbar.tsx";

const TeacherPanelPage = () => {
    const [alert, setAlert] = useState<string | null>(null);

    const alertUser = (msg: string) => {
        setAlert(msg);
        setTimeout(() => setAlert(null), 2000);
    };

    return (
        <>
            <Navbar />
            {alert && (
                <Alert variant="success" className="m-3">
                    {alert}
                </Alert>
            )}

            <Tabs
                defaultActiveKey="create"
                id="teacher-panel-tabs"
                className="mb-3"
            >
                <Tab eventKey="create" title="Create Task">
                    <TeacherCreateTaskForm onSuccess={() => alertUser("Task has been created successfully.")}/>
                </Tab>

                <Tab eventKey="update" title="Update Task">
                    <TeacherUpdateTaskForm onSuccess={() => alertUser("Task has been updated successfully.")}/>
                </Tab>

                <Tab eventKey="delete" title="Delete Task">
                    <TeacherDeleteTaskForm onSuccess={() => alertUser("Task has been deleted successfully.")}/>
                </Tab>
            </Tabs>
        </>
    );
};

export default TeacherPanelPage;