import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actionsCreators from '../actions/actionCreators';
import PersonalFiles from '../components/PersonalFiles';

PersonalFiles.propTypes = {
  state: PropTypes.shape({
    files: PropTypes.array.isRequired,
    listView: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
  }),
  dispatch: PropTypes.shape({
    socketConnect: PropTypes.func.isRequired,
    socketEnd: PropTypes.func.isRequired,
    socketListDir: PropTypes.func.isRequired,
    switchView: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = (state) => {
  return {
    state: {
      files: state.personalFilesReducer,
      listView: state.viewSwitcherReducer,
      path: state.pathReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      socketConnect: () => {
        dispatch(actionsCreators.socketConnect());
      },
      socketEnd: () => {
        dispatch(actionsCreators.socketEnd());
      },
      socketListDir: (path='') => {
        dispatch(actionsCreators.socketListDir(path));
        dispatch(actionsCreators.switchPath(path));
      },
      switchView: () => {
        dispatch(actionsCreators.switchView());
      },
      addFile: () => {
        const file = {id: "1", detail:"35Ko"};
        dispatch(actionsCreators.addFile(file));
      },
    }
  }
}

const PersonalFilesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalFiles)

export default PersonalFilesContainer;
