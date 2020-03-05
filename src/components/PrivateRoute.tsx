import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { isAuthenticated } from '../utils/utils'
import { useService } from './ServiceProvider';

type Props = {
    component: any;
    cookies?: any;
}
type IPrivateRoute = Props & RouteProps;

const PrivateRoute: React.FC<IPrivateRoute> = ({ component: Component, cookies, ...rest }) => {
    const service = useService();
    const protectedRender = (props: any) => {
        if (isAuthenticated(service, cookies)) {
            return <Component {...props} />
        }
        return <Redirect to='/login' />
    }
    return (
        <Route {...rest} render={(props) => protectedRender(props)} />
    )
}

export default withCookies(PrivateRoute)
