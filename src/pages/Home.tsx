import React, { useEffect, useState } from 'react'
import { withCookies } from 'react-cookie';
import { Octokit } from "@octokit/rest";
interface Props {
    cookies: any;
}


const Home: React.FC<Props> = ({ cookies }) => {

    const [user, setUser] = useState({
        name: "",
    })

    useEffect(() => {
        const getUserData = async () => {
            const token = cookies.get("token");
            if (token) {
                const octokit = new Octokit({
                    auth: token
                });
                const response = await octokit.users.getAuthenticated();
                const userName = response.data.login;
                if (userName) {
                    setUser({ name: userName })
                }
            }
        }

        getUserData();
        // eslint-disable-next-line
    }, []);


    const renderHome = () => {
        return (
            <p>Welcom Home, {user.name}</p>
        )
    }

    return renderHome();


}

export default withCookies(Home)
