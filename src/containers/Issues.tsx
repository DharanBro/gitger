import React, { useEffect, useState } from 'react'
import { withCookies } from 'react-cookie';
import { Octokit } from "@octokit/rest";
import { CSVDownload } from "react-csv";
import { HEADERS, ISSUE_TYPES, ISSUE_STATUS } from "../constants/Issues"

interface Props {
    cookies: any;
}

interface Repo {
    name: string;
    private: boolean;
    full_name: string;
    description: string;
    url: string;
}

interface Issue {
    number: number;
    title: string;
    body: string;
    reporter: string;
    issueType: string;
    issueStatus: string;
    component: string;
}

const Issues: React.FC<Props> = ({ cookies }) => {

    let cookeieToken = cookies.get("token");
    cookeieToken = cookeieToken === "undefined" ? undefined : cookeieToken;
    let repos: Repo[] = [],
        octokit: Octokit = new Octokit({
            auth: cookeieToken
        });

    const [issues, setIssues] = useState({
        repos: repos
    });

    const downloadIssue: any = async (repoName: string, repoFullName: string) => {

        if (octokit !== undefined) {

            let result: Issue[] = [];

            const repoFullNameArr = repoFullName.split("/"),
                response = await octokit.issues.listForRepo({
                    owner: repoFullNameArr[0],
                    repo: repoFullNameArr[1],
                    state: "all",
                    sort: "updated",
                    direction: "desc",
                    per_page: 100,
                    page: 1
                });

            console.log(repoFullName, response);

            if (response && response.status === 200) {
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
                        body: data.body,
                        reporter: data.user.login,
                        issueType: issueType,
                        issueStatus: issueStatus,
                        component: component
                    })
                });
            }
            return (
                <CSVDownload data={result} headers={HEADERS} filename={`${repoName}.csv`} target="_self">
                    Download Issues
                </CSVDownload>
            );

        } else {
            return null;
        }

    };

    const getRepoTable = (repos: Repo[]) => {

        let table: any[] = [];

        {
            repos.forEach(repo => {
                table.push(
                    <tr>
                        <td>{repo.name}</td>
                        <td>{repo.url}</td>
                        <td>{repo.description}</td>
                        <td>
                            <button onClick={() => downloadIssue(repo.name, repo.full_name)} >Download {repo.name}</button>
                        </td>
                    </tr>
                )
            })
        }

        return table;
    }

    useEffect(() => {
        const getRepoData = async () => {
            if (cookeieToken && octokit) {
                const reposResp = await octokit.repos.list({ per_page: 100, page: 1 });
                console.log("repos", issues);
                if (reposResp && reposResp.status === 200) {

                    reposResp.data.forEach((repoData: any) => {
                        repos.push({
                            name: repoData.name,
                            private: repoData.private,
                            full_name: repoData.full_name,
                            description: repoData.description,
                            url: repoData.html_url
                        })
                    });
                }

                setIssues({
                    repos: repos
                })
            }
        }

        getRepoData();
        // eslint-disable-next-line
    }, []);
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td>
                            Name
                        </td>
                        <td>
                            URL
                        </td>
                        <td>
                            Description
                        </td>
                        <td>
                            Export
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {getRepoTable(issues.repos)}
                </tbody>
            </table>

        </div>
    )
}

export default withCookies(Issues)