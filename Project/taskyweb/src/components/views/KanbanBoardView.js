import React, { Component } from "react";
import Board from "@lourenci/react-kanban";
import "@lourenci/react-kanban/dist/styles.css";

export default class KanbanBoardView extends Component {
  constructor(props) {
    super(props);
    this.state = { boardData: [] };
  }
  componentDidMount = () => {
    this.initialize();
  };

  initialize = async () => {
    let boardData = await this.props.fetchBoardData();
    boardData = this.props.boardExtractor(boardData);
    this.setState({ boardData: boardData ? boardData : [] });
  };

  render() {
    console.warn(this.state.boardData);
    if (this.state.boardData && this.state.boardData.columns && this.state.boardData.columns.length > 0) {
      return (
        <Board
          initialBoard={this.state.boardData}
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
