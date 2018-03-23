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
    listLogins: PropTypes.func.isRequired,
  }),
}

const mapStateToProps = (state) => {
  return {
    state: {
      authenticated: state.authenticationReducer.authenticated,
      logins: state.authenticationReducer.logins,
      socket: state.socketReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      init: () => {},
      listLogins: () => dispatch(actionsCreators.SocketListLogins()),
      login: (identity, password) => dispatch(actionsCreators.socketLogin(identity, password)),
      mount: (mountpoint) => dispatch(actionsCreators.mountFilesystem(mountpoint))
    }
  }
}

const LoginContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login))

export default LoginContainer
