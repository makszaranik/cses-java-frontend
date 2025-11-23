import React, {useState} from 'react';
import {Button} from "react-bootstrap";
import {SubmissionFileType} from "../../types";

interface FileUploadProps {
    fileType: SubmissionFileType;
    buttonText?: string;
    onFileUploaded?: (fileId: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({fileType, buttonText="upload", onFileUploaded}) => {
    const [drag, setDrag] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function dragStartOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDrag(true);
    }

    function dragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDrag(false);
    }

    function onDropEventHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDrag(false);
        const dropped = [...e.dataTransfer.files];
        if (dropped.length > 0) setFile(dropped[0]);
    }

    async function handleUploadFile(e: React.FormEvent) {
        e.preventDefault();
        if (!file || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('fileType', fileType.toString());

            const res = await fetch("http://localhost:8000/api/files/upload", {
                method: "POST",
                credentials: "include",
                body: fd
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            const fileId = data.id;
            console.log(fileId);
            console.log(file);
            if (onFileUploaded) {
                onFileUploaded(fileId);
            }

            alert("File uploaded successfully!");
        } catch (err) {
            console.error(err);
            alert("Error while uploading file");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <div
                className={`flex mt-10 ml-60 w-50 h-40 items-center justify-center border-2 border-dashed 
        ${drag ? "bg-gray-100" : ""}`}
                onDragStart={dragStartOverHandler}
                onDragLeave={dragLeave}
                onDragOver={dragStartOverHandler}
                onDrop={onDropEventHandler}
            >
                {drag ? "Drop file" : file ? file.name : "Move file here"}
            </div>

            <div className="flex ml-60 mt-3">
                <Button onClick={handleUploadFile} variant="dark" disabled={isSubmitting}>
                    {isSubmitting ? "Uploading..." : buttonText}
                </Button>
            </div>
        </div>
    );
};

export default FileUpload;
