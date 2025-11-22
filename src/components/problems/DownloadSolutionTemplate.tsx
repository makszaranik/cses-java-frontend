import React from 'react';
import { useAuthStore } from "../../state";
import { Button } from "react-bootstrap";

interface TestsPageProps {
    solutionTemplateFileId?: string;
}

export const DownloadSolutionTemplate: React.FC<TestsPageProps> = ({ solutionTemplateFileId }) => {
    const user = useAuthStore(state => state.user);

    const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!solutionTemplateFileId) {
            console.error("File ID not provided");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/files/download/${solutionTemplateFileId}`, {
                credentials: "include"
            });
            if (!response.ok) throw new Error("Error downloading file");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "solution.zip";
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            {user && (
                <div>
                    <Button onClick={handleOnClick} variant="dark" style={{ width: "100%" }}>
                        Download solution template
                    </Button>
                </div>
            )}
        </>
    );
};
