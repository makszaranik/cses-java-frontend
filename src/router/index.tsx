import React from "react";
import LoginPage from "../pages/LoginPage.tsx";
import MainPage from "../pages/MainPage.tsx";
import ProblemSetPage from "../pages/ProblemSetPage.tsx";
import ProblemPage from "../pages/ProblemPage.tsx";
import ProblemSubmissionPage from "../pages/ProblemSubmissionPage.tsx";
import ProblemResultsPage from "../pages/ProblemResultsPage.tsx";
import StatisticsPage from "../pages/StatisticsPage.tsx";
import TeacherPanelPage from "../pages/TeacherPanelPage.tsx";

export interface IRoute {
    path: string;
    element: React.ReactNode;
}

export enum RouteNames {
    LOGIN = '/login',
    PROBLEM_SET = '/problemset',
    MAIN = '/',
    TEACHER_PANEL = '/teacher-panel',
}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, element: <LoginPage/>},
    {path: RouteNames.PROBLEM_SET, element: <ProblemSetPage/>},
    {path: RouteNames.MAIN, element: <MainPage/>},
    {path: RouteNames.PROBLEM_SET + '/task/:id', element: <ProblemPage/>},
    {path: RouteNames.PROBLEM_SET + '/submit/:id', element: <ProblemSubmissionPage/>},
    {path: RouteNames.PROBLEM_SET + '/results/:id', element: <ProblemResultsPage/>},
    {path: RouteNames.PROBLEM_SET + '/statistics/:id', element: <StatisticsPage/>},
    {path: RouteNames.TEACHER_PANEL, element: <TeacherPanelPage/>},
];

export const privateRoutes: IRoute[] = []