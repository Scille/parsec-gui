import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import Signup from '../components/Signup'


Signup.propTypes = {
  state: PropTypes.shape({
    authentication: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.shape({
    signup: PropTypes.func.isRequired,
    configureDevice : PropTypes.func.isRequired,
  }),
}

const mapStateToProps = (state) => {
  return {
    state: {
      authentication: state.authenticationReducer,
      socket: state.socketReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      init: () => {},
      signup: (identity, password, invitation_token) => dispatch(actionsCreators.socketSignup(identity, password, invitation_token)),
      configureDevice: (identity, password, invitation_token) => dispatch(actionsCreators.socketConfigureDevice(identity, password, invitation_token)),
    }
  }
}

const SignupContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup))

export default SignupContainer
