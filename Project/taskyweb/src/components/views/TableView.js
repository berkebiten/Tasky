import React, { Component } from "react";
import { Table } from "antd";

export default class TableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }

  render() {
    return (
      <Table columns={this.props.columns} dataSource={this.props.tableData} />
    );
  }
}
