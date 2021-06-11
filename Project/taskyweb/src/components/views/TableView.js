import React, { Component } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default class TableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      searchText: "",
      searchedColumn: "",
    };
  }

  onDoubleClick = (event) => {
    let index = event.currentTarget.rowIndex;
    if (this.props.onDoubleClickRow) {
      this.props.onDoubleClickRow(index);
    }
  };

  getColumnSearchProps = (dataIndex, item) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                this.handleSearch(selectedKeys, confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select(), 100);
        }
      },
    };
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  getColumns = () => {
    let columns = this.props.columns;
    let newColumns = [];
    if (columns) {
      columns.map((item, key) => {
        let data = { ...item };
        if (
          item.title === "Title" ||
          item.title === "Description" ||
          item.title === "Task"
        ) {
          data = { ...data, ...this.getColumnSearchProps(item.dataIndex) };
        }
        newColumns.push(data);
      });
    }
    console.log(newColumns);
    return newColumns;
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
        pagination={this.props.pagination ? this.props.pagination : null}
        className="task-list"
        columns={this.getColumns()}
        dataSource={this.props.tableData}
        loading={this.props.loading ? this.props.loading : false}
        bordered
      />
    );
  }
}
