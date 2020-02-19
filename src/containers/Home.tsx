import React, { useEffect, useState } from 'react'
import { withCookies } from 'react-cookie';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { Octokit } from "@octokit/rest";
interface Props {
    cookies: any;
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
            width: 250,
        },
        div: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh -  64px)",
        }
    }),
);

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}



const Home: React.FC<Props> = ({ cookies }) => {
    console.log("render home")
    const classes = useStyles();
    let query = useQuery();
    const code = query.get("code");
    let cookeieToken = cookies.get("token");
    cookeieToken = cookeieToken === "undefined" ? undefined : cookeieToken;
    const [user, setUser] = useState({
        name: "",
    })

    const getAccesToken = async () => {
        const response = await axios.get(`https://gitger-gatekeeper.herokuapp.com/authenticate/${code}`);
        cookies.set('token', response.data.token, { path: '/' });
        return response.data.token
    }

    useEffect(() => {
        const getTokenAndData = async () => {
            let token = cookeieToken;
            if (code && !token) {
                token = await getAccesToken();

            }
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

        getTokenAndData();
        // eslint-disable-next-line
    }, []);

    const loginWithGithub = () => {
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=a6f5adc4aade86988989&redirect_uri=http://localhost:3000/home&scope=repo';
    }

    const renderLoginButton = () => {
        return (
            <div className={classes.div}>
                <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    startIcon={<GitHubIcon />}
                    onClick={loginWithGithub}
                >
                    {"Login with Github"}
                </Button>
            </div>
        )
    }

    const renderHome = () => {
        return (
            <p>Welcom Home, {user.name}</p>
        )
    }


    if (!code && !cookeieToken) {
        return renderLoginButton();
    }

    return renderHome();


}

export default withCookies(Home)
