import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import * as actionsCreators from '../actions/actionCreators';
import PersonalFiles from '../components/PersonalFiles';

PersonalFiles.propTypes = {
  state: PropTypes.shape({
    files: PropTypes.array.isRequired,
    listView: PropTypes.bool.isRequired,
  }),
  dispatch: PropTypes.shape({
    addFile: PropTypes.func.isRequired,
    refreshFiles: PropTypes.func.isRequired,
    switchView: PropTypes.func.isRequired,
    socketConnect: PropTypes.func.isRequired,
    socketEnd: PropTypes.func.isRequired,
  }),

};

const mapStateToProps = (state) => {
  return {
    state: {
      files : state.personalFilesReducer,
      listView: state.viewSwitcherReducer
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      addFile: () => {
        const file = {id: "1", detail:"35Ko"};
        dispatch(actionsCreators.addFile(file))
      },
      refreshFiles: () => {
        dispatch(actionsCreators.refreshFiles('/'))
      },
      switchView: () => {
        dispatch(actionsCreators.switchView())
      },
      socketConnect: () => {
        dispatch(actionsCreators.socketConnect())
      },
      socketEnd: () => {
        dispatch(actionsCreators.socketEnd())
      }
    }
  }
}

const PersonalFilesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalFiles)

export default PersonalFilesContainer;
