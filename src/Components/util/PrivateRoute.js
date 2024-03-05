import React from 'react'
import {
  Route,
  Redirect

} from 'react-router-dom'

import auth from '../../services/authService'
import PropTypes from 'prop-types'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest} render={(props) => (
      auth?.isAuthenticated()
        ? <Component {...props} />
        : <Redirect to={{
          pathname: '/login',
          state: { from: props }
        }}
          />
    )}
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired
}

export default PrivateRoute
