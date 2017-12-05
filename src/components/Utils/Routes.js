import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export function PrivateRoute({ component: Component, authed, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => (authed === true
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
        />
    );
}

PrivateRoute.propTypes = {
    component: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
    ]),
    authed: PropTypes.bool,
    location: PropTypes.object,
};

PrivateRoute.defaultProps = {
    authed: false,
    component: null,
    location: {},
};

export function PublicRoute({ component: Component, authed, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => (authed === false
                ? <Component {...props} />
                : <Redirect to="/dashboard" />)}
        />
    );
}

PublicRoute.propTypes = {
    component: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
    ]),
    authed: PropTypes.bool,
};

PublicRoute.defaultProps = {
    authed: false,
    component: null,
};
