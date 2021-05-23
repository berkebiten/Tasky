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
      <Card className="kanban-card">
        <Card.Header>{item.title}</Card.Header>
        <Card.Body>
          <Card.Text>{item.description}</Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">
          <Icon name="user" />
          {item.assigneeFirstName} {item.assigneeLastName}
          <br />
          <Icon name="calendar check outline" />
          {moment(item.dueDate).format("DD/MM/YYYY")}
        </Card.Footer>
      </Card>
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
        />
      );
    } else {
      return null;
    }
  }
}
