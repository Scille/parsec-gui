import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import DeletedFiles from '../components/DeletedFiles'

DeletedFiles.propTypes = {
  state: PropTypes.shape({
    files: PropTypes.array.isRequired,
    listView: PropTypes.bool.isRequired,
  }),
  dispatch: PropTypes.shape({
    init: PropTypes.func.isRequired,
    end: PropTypes.func.isRequired,
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
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      init: () => dispatch(actionsCreators.socketConnect('show_dustbin')),
      end: () =>  dispatch(actionsCreators.socketEnd()),
      refresh: () => dispatch(actionsCreators.socketShowDustbin()),
      restoreFile: (id, name) => {
        dispatch(actionsCreators.socketRestoreFile(id, name))
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
