import React, { Component } from "react";
import Board, {moveCard} from "@lourenci/react-kanban";
import "../../res/styles/kanban-board.css";
import { Card } from "react-bootstrap";
import { Icon } from "semantic-ui-react";
import moment from "moment";
import { TextHelper } from "../../util/helpers";

export default class KanbanBoardView extends Component {
  constructor(props) {
    super(props);
  }

  renderCard = (item) => {
    return (
      <a href={"/task/" + item.id}>
        <Card className="react-kanban-card stretched-link">
          <Card.Header className="rkc-header">{TextHelper.getSmallText(item.title,19)}</Card.Header>
          <Card.Body className="rkc-body">
            <Card.Text>{TextHelper.getSmallText(item.description,50)}</Card.Text>
          </Card.Body>
          <Card.Footer className="rkc-footer text-muted">
            <Icon name="user" />
            {TextHelper.getSmallText(item.assigneeFullName,20)}
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
