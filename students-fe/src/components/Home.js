import React, { Component } from "react";
import { Col, Container, Row, Button } from "reactstrap";
import StudentList from "./StudentList";
import NewStudentModal from "./NewStudentModal";

import addUserSetDialog from "./add-user-set-dialog";

import axios from "axios";

import { API_URL } from "../constants";

class Home extends Component {
  state = {
    showAddUserSetDialog: false,
    students: []
  };

  componentDidMount() {
    this.resetState();
  }

  getStudents = () => {
    axios.get(API_URL).then(res => this.setState({ students: res.data }));
  };

  resetState = () => {
    this.getStudents();
  };

  toggleAddUserSetDialog = () => {
    this.setState({
      showAddUserSetDialog: !this.state.showAddUserSetDialog
    })
  };

  addItem = () => {
    console.log("addItem");
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <Row>
          <Col>
            <StudentList
              students={this.state.students}
              resetState={this.resetState}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewStudentModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={this.toggleAddUserSetDialog}>add user set</Button>
          </Col>
        </Row>
        {this.state.showAddUserSetDialog &&
          <addUserSetDialog
            toggleDialog={this.toggleAddUserSetDialog}
            addItem={this.addItem}
          />
        }
      </Container>
    );
  }
}

export default Home;
