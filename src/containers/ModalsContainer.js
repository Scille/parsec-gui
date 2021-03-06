import { connect } from 'react-redux'

import Modals from '../components/Modals'

const mapStateToProps = (state) => {
  return state.modalReducer
}

const ModalsContainer = connect(
  mapStateToProps,
)(Modals)

export default ModalsContainer
