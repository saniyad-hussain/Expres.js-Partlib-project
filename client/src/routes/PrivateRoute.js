import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import rolesConfig from "../config/rolesConfig";
import * as Routes from './index';
import NotFound from "../components/404/NotFound";


const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  let allowedRoutes;
  if (auth.isAuthenticated) {
    allowedRoutes = rolesConfig[auth.user.role].routes;
  } else {
    return (
      <Route
        render={props =>
          <Redirect to="/login" />
        }
      />
    )
  }
  return (
    <>
      {allowedRoutes &&
        allowedRoutes.map((route) => (
          <Route
            exact
            key={route.url}
            component={Routes[route.component]}
            path={`${route.url}`}
          />
        ))}
    </>
  )
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
