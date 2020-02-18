import React, { useEffect } from 'react';
import { Octokit } from '@octokit/rest';


interface Props {

}

const Issues: React.FC<Props> = () => {
    useEffect(() => {
        const octokit = new Octokit({
            auth: "c654172c0bcd2f03d5366b18bdb3be50a9ec95e4"
        });
        async function getIssues() {
            let issues = await octokit.issues.listForRepo({
                owner: 'dharanbro',
                repo: 'hapi-sequelize-restify',
            });
            console.log(issues);
        };

        getIssues();
    }, [])
    return (
        <div>
            Issues
        </div>
    )
}

export default Issues
