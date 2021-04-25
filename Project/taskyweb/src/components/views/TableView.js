import React, { Component } from "react";
import { Table } from "antd";

export default class TableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }

  fetchTaskList = () => {};

  componentDidMount = () => {
    this.initialize();
  };

  initialize = async () => {
    let tableData = await this.props.fetchTableData();
    this.setState({ tableData: tableData ? tableData : [] });
  };

  render() {
    return (
      <Table columns={this.props.columns} dataSource={this.state.tableData} />
    );
  }
}
