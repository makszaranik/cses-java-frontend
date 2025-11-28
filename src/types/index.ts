export interface IProblem {
    id: string;
    title: string;
    statement: string;
    timeRestriction: number;
    memoryRestriction: number;
    solutionTemplateFileId: string;
    testsFileId: string;
    lintersFileId: string;
    testsPoints: number;
    lintersPoints: number;
    submissionsNumberLimit: number;
}

export interface ISubmission {
    id: string;
    taskId: string;
    userId: string;
    sourceCodeFileId: string;
    logs: Record<string, string>;
    status: SubmissionStatus;
    score: number;
    createdAt: Date;
}

export type SubmissionStatus =
    "LINTER_PASSED" |
    "LINTER_FAILED" |
    "SUBMITTED" |
    "COMPILING" |
    "COMPILATION_SUCCESS" |
    "COMPILATION_ERROR" |
    "WRONG_ANSWER" |
    "ACCEPTED" |
    "TIME_LIMIT_EXCEEDED" |
    "OUT_OF_MEMORY_ERROR";

export enum SubmissionFileType {
    SOLUTION = "SOLUTION",
    SOLUTION_TEMPLATE = "SOLUTION_TEMPLATE",
    TEST = "TEST",
    LINTER = "LINTER",
}