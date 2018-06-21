import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import App from '../components/App'

App.propTypes = {
  state: PropTypes.shape({
    authentication: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.shape({
    init: PropTypes.func.isRequired,
    end: PropTypes.func.isRequired,
    logged: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    umount: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    inviteUser: PropTypes.func.isRequired,
    declareDevice: PropTypes.func.isRequired,
    endDeclareDevice: PropTypes.func.isRequired,
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
      logout: () => dispatch(actionsCreators.socketLogout()),
      umount: () => dispatch(actionsCreators.umountFilesystem()),
      showModal: (modalType, modalProps) => dispatch(actionsCreators.showModal(modalType, modalProps)),
      hideModal: () => dispatch(actionsCreators.hideModal()),
      inviteUser: (user) => dispatch(actionsCreators.socketInviteUser(user)),
      declareDevice: (device) => {
        dispatch(actionsCreators.socketDeclareDevice(device))
        dispatch(actionsCreators.socketEventSubscribe('device_try_claim_submitted'))
      },
      endDeclareDevice: () => dispatch(actionsCreators.socketEventUnsubscribe('device_try_claim_submitted')),
      listenEvents: (notify) => dispatch(actionsCreators.socketEventListen(notify)),
      acceptDevice: (try_id, password) => dispatch(actionsCreators.socketAcceptDevice(try_id, password)),
    }
  }
}

const AppContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))

export default AppContainer