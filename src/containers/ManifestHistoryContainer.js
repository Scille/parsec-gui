import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import ManifestHistory from '../components/ManifestHistory'

ManifestHistory.propTypes = {
  state: PropTypes.shape({
    history: PropTypes.array.isRequired,
    socket: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.shape({
    init: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    restoreVersion: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
  }),
}

const mapStateToProps = (state) => {
  return {
    state: {
      history: state.historyReducer,
      socket: state.socketReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      init: () => dispatch(actionsCreators.socketHistory()),
      refresh: () => dispatch(actionsCreators.socketHistory()),
      restoreVersion: (version) => dispatch(actionsCreators.socketRestoreVersion(version)),
      showModal: (modalType, modalProps) => dispatch(actionsCreators.showModal(modalType, modalProps)),
      hideModal: () => dispatch(actionsCreators.hideModal()),
    }
  }
}

const ManifestHistoryContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestHistory))

export default ManifestHistoryContainer
