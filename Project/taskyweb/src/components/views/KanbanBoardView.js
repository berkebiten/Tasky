import React, { Component } from "react";
import Board from "@lourenci/react-kanban";
import "../../res/styles/kanban-board.css";
import { Card } from "react-bootstrap";
import { Icon } from "semantic-ui-react";
import moment from "moment";

export default class KanbanBoardView extends Component {
  constructor(props) {
    super(props);
  }

  renderCard = (item) => {
    return (
      <a href={"/task/" + item.id}>
        <Card className="react-kanban-card stretched-link">
          <Card.Header className="rkc-header">{item.title}</Card.Header>
          <Card.Body className="rkc-body">
            <Card.Text>{item.description}</Card.Text>
          </Card.Body>
          <Card.Footer className="rkc-footer text-muted">
            <Icon name="user" />
            {item.assigneeFullName}
            <br />
            <Icon name="calendar check outline" />
            {moment(item.dueDate).format("DD/MM/YYYY")}
          </Card.Footer>
        </Card>
      </a>
    );
  };

  render() {
    if (
      this.props.boardData &&
      this.props.boardData.columns &&
      this.props.boardData.columns.length > 0
    ) {
      return (
        <Board
          initialBoard={this.props.boardData}
          allowAddColumn={false}
          disableColumnDrag={true}
          onCardDragEnd={this.props.onCardDragEnd}
          renderCard={(item) => this.renderCard(item)}
          disableCardDrag={this.props.disableCardDrag}
        />
      );
    } else {
      return null;
    }
  }
}
