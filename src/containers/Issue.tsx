import React, { useEffect, useState } from 'react'
import { withCookies } from 'react-cookie';
import { Octokit } from "@octokit/rest";
import { CSVDownload } from "react-csv";
import { HEADERS, ISSUE_TYPES, ISSUE_STATUS } from "../constants/Issues";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import {
    BrowserRouter as Router,
    Link,
    useLocation
} from "react-router-dom";

interface Props {
    cookies: any;
}

interface Issue {
    number: number;
    title: string;
    state:string;
    body: string;
    reporter: string;
    issueType: string;
    issueStatus: string;
    component: string;
    createdAt: string;
    updatedAt: string;
    closedAt: string;
}

const Issue: React.FC<Props> = ({ cookies }) => {

    let cookeieToken = cookies.get("token");
    cookeieToken = cookeieToken === "undefined" ? undefined : cookeieToken;
    let issuesArr: Issue[] = [],
        octokit: Octokit = new Octokit({
            auth: cookeieToken
        });
    const columnDefs = [
        { headerName: "Issue Number", field: "number" },
        { headerName: "Issue Title", field: "title" },
        { headerName: "Issue Status", field: "status" },
        { headerName: "Description", field: "body" },
        { headerName: "Reported By", field: "reporter" },
        { headerName: "Issue Type", field: "issueType" },
        { headerName: "Issue Status", field: "issueStatus" },
        { headerName: "Component", field: "component" },
        { headerName: "Created At", field: "createdAt" },
        { headerName: "updated At", field: "updatedAt" },
        { headerName: "Closed At", field: "closedAt" },

    ];

    let gridOptions: any = null;

    const [issues, setIssues] = useState({
        rowData: issuesArr,
        columnDefs: columnDefs,
        gridOptions: gridOptions
    });


    // A custom hook that builds on useLocation to parse
    // the query string for you.
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();

    let rowData = [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }
    ];

    useEffect(() => {
        const getRepoData = async () => {

            let repoFullName = query.get('full_name');

            if (octokit !== undefined && repoFullName !== null) {

                let result: Issue[] = [];
                let hasNextPage = true;
                let currPage = 1;
                let pageSize = 100;
                while (hasNextPage) {

                    const repoFullNameArr = repoFullName.split("/"),
                        response = await octokit.issues.listForRepo({
                            owner: repoFullNameArr[0],
                            repo: repoFullNameArr[1],
                            state: "all",
                            sort: "updated",
                            direction: "desc",
                            per_page: pageSize,
                            page: currPage
                        });
                    console.log("Issue API Response ", response, "currPage ", currPage, " pageSize", pageSize);
                    if (response && response.status === 200) {
                        if (response.data.length < pageSize) {

                            hasNextPage = false;
                        } {
                            currPage++
                        }
                        response.data.forEach(data => {
                            let issueType = "",
                                issueStatus = "",
                                component = "";

                            if (data.labels) {
                                data.labels.forEach((label) => {
                                    if (label.name.toLowerCase().indexOf("xviz") !== -1) {
                                        component = label.name;
                                    }
                                    if (ISSUE_STATUS.indexOf(label.name.toLowerCase()) !== -1) {
                                        issueStatus = label.name;
                                    }
                                    if (ISSUE_TYPES.indexOf(label.name.toLowerCase()) !== -1) {
                                        issueType = label.name;
                                    }
                                })
                            }

                            result.push({
                                number: data.number,
                                title: data.title,
                                state: data.state,
                                body: data.body,
                                reporter: data.user.login,
                                issueType: issueType,
                                issueStatus: issueStatus,
                                component: component,
                                createdAt: data.created_at ? new Date(data.created_at).toLocaleDateString() : "",
                                updatedAt: data.updated_at ? new Date(data.updated_at).toLocaleDateString() : "",
                                closedAt: data.closed_at ? new Date(`${data.closed_at}`).toLocaleDateString() : ""
                            })
                        });
                    } else {
                        hasNextPage = false;
                    }

                }

                setIssues({
                    rowData: result,
                    columnDefs: columnDefs,
                    gridOptions: issues.gridOptions
                })

            }
        }

        getRepoData();
        // eslint-disable-next-line
    }, []);
    return (
        <div className="ag-theme-balham" style={{ height: '650px' }}>
            <button
                onClick={() => {
                    if (issues.gridOptions !== null && issues.gridOptions.api) {
                        issues.gridOptions.api.exportDataAsCsv({
                            fileName: 'xViz',
                            sheetName: 'xViz',
                            allColumns: true
                        })
                    }
                }
                }>
                Download CSV
            </button>
            <AgGridReact
                columnDefs={issues.columnDefs}
                rowData={issues.rowData}
                onGridReady={(e) => { issues.gridOptions = e; }}>
            </AgGridReact>

        </div>
    )
}

export default withCookies(Issue)