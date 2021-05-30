import React, { Component } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  Legend,
  Bar,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import { ServiceHelper } from "../../util/helpers";
import { GET_PROJECT_REPORT } from "../../util/constants/Services";
import { Container, Row, Col, Card } from "react-bootstrap";
import CustomCard from "../material-components/CustomCard";
import HourIcon from "@material-ui/icons/QueryBuilder";
import TaskIcon from "@material-ui/icons/FormatListBulleted";

export default class ReportView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initialize();
  }

  initialize = async () => {
    await ServiceHelper.serviceHandler(
      GET_PROJECT_REPORT + this.props.projectId,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.data && response.isSuccessfull) {
        this.setState({
          report: response.data,
        });
      }
    });
  };

  createTaskStatuses = () => {
    if (
      this.state.report.taskStatusReport &&
      this.state.report.taskStatusReport.length > 0
    ) {
      return (
        <BarChart
          width={730}
          height={250}
          data={this.state.report.taskStatusReport}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      );
    }
    return null;
  };

  createParticipantRoleChart = () => {
    if (
      this.state.report.participantRep &&
      this.state.report.participantRep.length > 0
    ) {
      console.log(this.state.report);
      return (
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart
            innerRadius="10%"
            outerRadius="80%"
            data={this.state.report.participantRep}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              minAngle={15}
              label={{ fill: "#666", position: "insideStart" }}
              background
              clockWise={true}
              dataKey="count"
            />
            <Legend
              formatter={(value, entry, index) => (
                <span>{entry.payload.role}</span>
              )}
            />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      );
    }
    return null;
  };

  createParticipantWorkHours = () => {
    if (
      this.state.report.workHoursReport &&
      this.state.report.workHoursReport.length > 0
    ) {
      return (
        <BarChart
          width={450}
          height={250}
          data={this.state.report.workHoursReport}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fullName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="workHour" fill="#8884d8" />
        </BarChart>
      );
    }
    return null;
  };

  create = (info, title, icon) => {
    return <CustomCard info={info} title={title} icon={icon} />;
  };

  render() {
    if (this.state.report) {
      return (
        <Container className="dark-overview-container">
          <Row className="mt-2 project-detail-row mx-auto">
            <Col md={5}>
              {this.create(
                this.state.report.taskCount,
                "Number of Tasks",
                <TaskIcon fontSize="large" />
              )}
            </Col>
            <Col md={6}>
              {this.create(
                this.state.report.totalWorkHour,
                "Total Work Hours",
                <HourIcon fontSize="large" />
              )}
            </Col>
          </Row>
          <Row className="mt-2 project-detail-row mx-auto">
            <Col md={5}>
              <Card text="dark" className="mb-2">
                <Card.Header>Project Participants</Card.Header>
                <Card.Body>{this.createParticipantRoleChart()}</Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card text="dark" className="mb-2">
                <Card.Header>Participant Work Hours</Card.Header>
                <Card.Body>{this.createParticipantWorkHours()}</Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-2 project-detail-row mx-auto">
            <Col md={11}>
              <Card text="dark" className="mb-2">
                <Card.Header>Task Statuses</Card.Header>
                <Card.Body>{this.createTaskStatuses()}</Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    } else {
      return null;
    }
  }
}
