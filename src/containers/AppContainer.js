import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import App from '../components/App'

App.propTypes = {
  state: PropTypes.shape({
    socket: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.shape({
    init: PropTypes.func.isRequired,
    end: PropTypes.func.isRequired,
    logged: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
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
      init: () => dispatch(actionsCreators.socketConnect()),
      end: () => dispatch(actionsCreators.socketEnd()),
      logged: () => dispatch(actionsCreators.socketLogged()),
      logout: (fs_pid) => {
        dispatch(actionsCreators.socketLogout())
        dispatch(actionsCreators.umountFilesystem(fs_pid))
      },
      showModal: (modalType, modalProps) => dispatch(actionsCreators.showModal(modalType, modalProps)),
      hideModal: () => dispatch(actionsCreators.hideModal()),
    }
  }
}

const AppContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))

export default AppContainer