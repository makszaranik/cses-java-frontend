import React from 'react';
import {Table} from "react-bootstrap";
import ProblemRow from "./ProblemRow.tsx";
import type { IProblem } from "../../types";

export interface ProblemsTableProps {
    problems: IProblem[];
}

const ProblemsTable: React.FC<ProblemsTableProps> = ({problems}) => {
    return (
        <div className="w-260">
            <div className="text-3xl ml-60 font-bold">Problems</div>
            <div className="ml-60 mt-2">
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Problem name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {problems.map(problem => (
                        <ProblemRow
                            key={problem.id}
                            id={problem.id}
                            title={problem.title}
                        />
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default ProblemsTable;