import {Component} from 'react'
import { Modal } from "rsuite";
import { withRouter } from "react-router-dom";

class CustomModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.isVisible}
        onHide={this.props.onClose}
        backdrop={this.props.backdrop}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.content}</Modal.Body>
      </Modal>
    );
  }
}
export default withRouter(CustomModal);
