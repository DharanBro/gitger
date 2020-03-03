import React, { useRef } from 'react';
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

import Issues from "./pages/Issues";
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import ServiceProvider from './components/ServiceProvider';
import Github from './services/Github';

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
    const service = useRef(new Github()).current;
    return (
        <ServiceProvider service={service}>
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
                            <PrivateRoute exact path="/" component={Home} />
                            <Route path="/login">
                                <Login />
                            </Route>
                            <PrivateRoute exact path="/home" component={Home} />
                            <PrivateRoute exact path="/issues" component={Issues} />
                        </Switch>
                    </div>
                </Router >
            </CookiesProvider>
        </ServiceProvider>
    )
}

export default App
