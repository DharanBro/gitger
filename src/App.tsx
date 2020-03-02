import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { CookiesProvider } from 'react-cookie';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Issue from "./containers/Issue";
import Issues from "./containers/Issues";
import Home from './containers/Home';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

interface Props {

}

const App: React.FC<Props> = () => {
    const classes = useStyles();
    return (
        <CookiesProvider>
            <Router>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {"Gitger"}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div>
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/home">
                            <Home />
                        </Route>
                        <Route path="/issues">
                            <Issues />
                        </Route>
                        <Route path="/issue">
                            <Issue />
                        </Route>
                    </Switch>
                </div>
            </Router >
        </CookiesProvider>
    )
}

export default App
