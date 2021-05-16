import React, { Component } from "react";
import Board from "@lourenci/react-kanban";
import "../../res/styles/kanban-board.css";

export default class KanbanBoardView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate = () => {
    console.log(this.props)
  }

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
        />
      );
    } else {
      return null;
    }
  }
}
