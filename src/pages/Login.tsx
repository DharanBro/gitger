import React, { useState } from 'react';
import { withCookies } from 'react-cookie';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Button } from '@material-ui/core';
import useStyles from '../styles';
import { useLocation, Redirect } from "react-router-dom";
import Github from '../services/Github';
import { isAuthenticated } from '../utils/utils'

interface Props {
    cookies: any;
}
type LoginStatus = 'SUCCESS' | 'FAILED' | 'LOGGING_IN' | 'LOGGED_OUT';

const loginWithGithub = () => {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=a6f5adc4aade86988989&redirect_uri=http://localhost:3000/login&scope=repo';
}
// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Login: React.FC<Props> = ({ cookies }) => {
    const [loginStatus, setLoginStatus] = useState<LoginStatus>('LOGGED_OUT')
    const classes = useStyles();
    let query = useQuery();
    const code = query.get("code");

    if (code && loginStatus === 'LOGGED_OUT') {
        setLoginStatus('LOGGING_IN')
        Github.authenticate(code, cookies, (token) => {
            if (!token || typeof token in Error) {
                setLoginStatus('FAILED');
                return;
            }
            cookies.set('token', token, { path: '/' });
            setLoginStatus('SUCCESS');
        })
    }
    const renderGithubButton = (
        <Button
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<GitHubIcon />}
            onClick={loginWithGithub}
        >
            {"Login with Github"}
        </Button>
    );

    const render = () => {
        if (isAuthenticated(cookies)) {
            return <Redirect to='/home' />
        }
        if (loginStatus === 'LOGGED_OUT') {
            return renderGithubButton;
        }

        if (loginStatus === 'LOGGING_IN') {
            return <p>Logging in...</p>
        }

        if (loginStatus === 'FAILED') {
            return (
                <>
                    <p>Logging failed</p>
                    {renderGithubButton}
                </>
            )
        }

    }

    return (
        <div className={classes.div}>
            {render()}
        </div>
    )
}

export default withCookies(Login)
