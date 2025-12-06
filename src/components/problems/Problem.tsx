import React from 'react';

interface ProblemProps {
    title: string;
    statement: string;
    timeRestriction?: number;
    memoryRestriction: number;
    submissionsNumberLimit: number;
}

const Problem: React.FC<ProblemProps> = ({title, statement, memoryRestriction, submissionsNumberLimit}) => {
    return (
        <>
            <div className="text-3xl ml-60 mb-2 mt-2 font-bold">{title}</div>
            <div className="flex space-x-8 text-sm ml-45 text-gray-700">
                <div className="mt-4">
                    <span className="font-semibold">
                        Обмеження по памяті:
                    </span> {memoryRestriction} MB
                </div>
                <div className="mt-4">
                    <span className="font-semibold">
                        Доступна кількість спроб:
                    </span> {submissionsNumberLimit}
                </div>
            </div>
            <div className="mb-6 mt-4">
                <p>{statement}</p>
            </div>
        </>
    );
};

export default Problem;