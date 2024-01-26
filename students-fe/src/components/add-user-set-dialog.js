import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, Input, ModalBody, ModalFooter, Form, FormGroup, Label, Alert } from 'reactstrap';
import AlibabaUserSetSelect from './alibaba-user-set-select';


const propTypes = {
  addItem: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired
};

let logic = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
];

let fields = [
  { value: 'uid', label: 'uid' },
  { value: 'work_no', label: 'work_no' },
  { value: 'emp_name', label: 'emp_name' },
  { value: 'nick_name', label: 'nick_name' },
  { value: 'dept_name', label: 'dept_name' },
  { value: 'dept_name_en', label: 'dept_name_en' },
];

let operations = [
  { value: 'equal', label: 'equal' },
  { value: 'not-equal', label: 'not-equal' },
  { value: 'contains', label: 'contains' },
  { value: 'not-contains', label: 'not-contains' },
  { value: 'startswith', label: 'startswith' },
];

class SysAdminAddUserSetDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userSetID: '',
      userSetFilters: [{'field': 'uid',
                        'operation': 'equal',
                        'value': '',
                        'uniqueID': 'first one'}],
      errMessage: '',
      isSubmitBtnActive: false
    };
  }

  toggle = () => {
    this.props.toggleDialog();
  }

  handleUserSetIDChange = (e) => {

    if (!e.target.value.trim()) {
      this.setState({isSubmitBtnActive: false});
    } else {
      this.setState({isSubmitBtnActive: true});
    }

    this.setState({userSetID: e.target.value});
  }

  addUserSetFilter = () => {

    let filters = this.state.userSetFilters;
    let filterFields = filters.map(filter => filter.field);
    let result = fields.filter(field => !filterFields.includes(field.value));
    if (result.length === 0) {
      filters.push({'field': 'uid',
                    'operation': '',
                    'value': '',
                    'uniqueID': Math.random().toString(36)});
    } else {
      filters.push({'field': result[0].value,
                    'operation': '',
                    'value': '',
                    'uniqueID': Math.random().toString(36)});
    }

    this.setState({userSetFilters: filters}, () => {
      console.log(this.state.userSetFilters);
    });
  };

  updateUserSetFilter = (newFilter) => {
    let filters = this.state.userSetFilters;
    let existingFilterIndex = filters.findIndex(filter => filter.uniqueID === newFilter.uniqueID);

    if (existingFilterIndex !== -1) {
        filters[existingFilterIndex] = newFilter;
    } else {
        filters.push(newFilter);
    }
    this.setState({userSetFilters: filters}, () => {
      console.log(this.state.userSetFilters);
    });
  }

  deleteUserSetFilter = (uniqueID) => {
    let filters = this.state.userSetFilters.filter((item, index) => item.uniqueID !== uniqueID);
    this.setState({userSetFilters: filters}, () => {
      console.log(this.state.userSetFilters);
    });
  };

  handleSubmit = () => {
    this.props.addItem(this.state.userSetID, this.state.userSetFilters);
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
      e.preventDefault();
    }
  }

  render() {
    return (
      <Modal isOpen={true} toggle={this.toggle} style={{maxWidth: '600px', width: '100%' }}>
        <ModalHeader toggle={this.toggle}>{'New User Set'}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label className="mt-2">
                {'User Set ID'}
              </Label>
              <Input
                id="userSetID"
                onKeyPress={this.handleKeyPress}
                value={this.state.userSetID}
                onChange={this.handleUserSetIDChange}
              />
              <Label className="mt-2">
                {'Filters'}
              </Label>
              {this.state.userSetFilters.map((item, index) => (
                <div key={index} style={{ marginBottom: '16px' }}>
                  <AlibabaUserSetSelect
                    uniqueID={item.uniqueID}
                    field={item.field}
                    operation={item.operation}
                    value={item.value}
                    onSelectedValueChange={this.updateUserSetFilter}
                    onCloseClick={() => this.deleteUserSetFilter(item.uniqueID)}
                  />
                </div>
              ))}
            </FormGroup>
          </Form>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
               onClick={this.addUserSetFilter}>
            <div style={{ fontSize: '24px', marginRight: '8px' }}>+</div>
            <div>Add Filter</div>
          </div>
          {this.state.errMessage && <Alert color="danger">{this.state.errMessage}</Alert>}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>{'Cancel'}</Button>
          <Button color="primary" onClick={this.handleSubmit} disabled={!this.state.isSubmitBtnActive}>{'Submit'}</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

SysAdminAddUserSetDialog.propTypes = propTypes;

export default SysAdminAddUserSetDialog;
