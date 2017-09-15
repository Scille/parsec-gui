import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import Login from '../components/Login'


Login.propTypes = {
  state: PropTypes.shape({
    socket: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.shape({
    login: PropTypes.func.isRequired,
  }),
}

const mapStateToProps = (state) => {
  return {
    state: {
      authenticated: state.authenticated,
      socket: state.socketReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      init: () => {},
      login: (identity, password) => dispatch(actionsCreators.socketLogin(identity, password))
    }
  }
}

const LoginContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login))

export default LoginContainer
