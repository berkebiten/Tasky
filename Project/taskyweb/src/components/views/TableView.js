import React, { Component } from "react";
import { Table } from "antd";

export default class TableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }

  onDoubleClick = (event) => {
    let index = event.currentTarget.rowIndex;
    if (this.props.onDoubleClickRow) {
      this.props.onDoubleClickRow(index);
    }
  };

  render() {
    return (
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {}, // click row
            onDoubleClick: (event) => {
              this.onDoubleClick(event);
            }, // double click row
            onContextMenu: (event) => {}, // right button click row
            onMouseEnter: (event) => {}, // mouse enter row
            onMouseLeave: (event) => {}, // mouse leave row
          };
        }}
        className="task-list"
        columns={this.props.columns}
        dataSource={this.props.tableData}
        bordered
      />
    );
  }
}
