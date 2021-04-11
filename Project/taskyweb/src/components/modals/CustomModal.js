import { Component } from "react";
import { Modal } from "antd";
import { withRouter } from "react-router-dom";

class CustomModal extends Component {
  render() {
    return (
      <Modal
        visible={this.props.isVisible}
        onCancel={this.props.onClose}
        title={this.props.title}
        footer={null}
      >
        {this.props.content}
      </Modal>
    );
  }
}
export default withRouter(CustomModal);
