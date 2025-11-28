import React from 'react';
import { useAuthStore } from "../../state";
import { Button } from "react-bootstrap";
const host = import.meta.env.VITE_BACKEND_URL;

interface TestsPageProps {
    fileId?: string;
    buttonName?: string;
}

export const DownloadFileById: React.FC<TestsPageProps> = ({fileId, buttonName="Download solution template"}) => {
    const user = useAuthStore(state => state.user);

    const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!fileId) {
            console.error("File ID not provided");
            return;
        }

        try {
            const response = await fetch(`${host}/api/files/download/${fileId}`, {
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
                    <Button size="sm" onClick={handleOnClick} variant="dark">
                        {buttonName}
                    </Button>
                </div>
            )}
        </>
    );
};
