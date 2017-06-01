import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import DeletedFiles from '../components/DeletedFiles'

DeletedFiles.propTypes = {
  state: PropTypes.shape({
    files: PropTypes.array.isRequired,
    listView: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
  }),
  dispatch: PropTypes.shape({
    init: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    restoreFile: PropTypes.func.isRequired,
    switchView: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
  }),
}

const mapStateToProps = (state) => {
  return {
    state: {
      files: state.filesReducer,
      listView: state.viewSwitcherReducer,
      loading: state.socketReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      init: () => dispatch(actionsCreators.socketShowDustbin()),
      refresh: () => dispatch(actionsCreators.socketShowDustbin()),
      restoreFile: (file) => {
        dispatch(actionsCreators.socketRestoreFile(file))
        dispatch(actionsCreators.socketShowDustbin())
        dispatch(actionsCreators.hideModal())
      },
      switchView: () => dispatch(actionsCreators.switchView()),
      showModal: (modalType, modalProps) => dispatch(actionsCreators.showModal(modalType, modalProps)),
      hideModal: () => dispatch(actionsCreators.hideModal()),
    }
  }
}

const DeletedFilesContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DeletedFiles))

export default DeletedFilesContainer
