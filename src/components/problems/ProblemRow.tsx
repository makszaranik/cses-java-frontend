import React from 'react';
import {Link} from "react-router-dom";

interface ProblemProps {
    id: string;
    title: string,
}

const ProblemRow: React.FC<ProblemProps> = ({id, title}) => {
    return (
        <tr key={id}>
            <td>
                <Link to={`/problemset/task/${id}`}>{id}</Link>
            </td>
            <td>
                <Link to={`/problemset/task/${id}`}>{title}</Link>
            </td>
        </tr>
    );
};

export default ProblemRow;