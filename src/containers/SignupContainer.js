import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import Signup from '../components/Signup'


Signup.propTypes = {
  state: PropTypes.shape({
    socket: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.shape({
    signup: PropTypes.func.isRequired,
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
      signup: (identity, password) => dispatch(actionsCreators.socketSignup(identity, password)),
    }
  }
}

const SignupContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup))

export default SignupContainer
