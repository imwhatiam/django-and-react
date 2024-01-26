import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { seafileAPI } from '../../../../utils/seafile-api.js';
import { gettext } from '../../../../utils/constants';
import { Utils } from '../../../../utils/utils.js';
import toaster from '../../../../components/toast';

import '../../../../css/user-select.css';

const propTypes = {
  uniqueID: PropTypes.string,
  onSelectedValueChange: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired,
};

class AlibabaUserSetSelect extends React.Component {

  constructor(props) {
    super(props);
    this.options = [];
    this.finalValue = '';
    this.state = {
      field: this.props.field || '',
      opeartion: this.props.opeartion || '',
      value: this.props.value || '',
      searchValue: '',
    };
  }

  onInputChange = (searchValue) => {
    this.setState({ searchValue });
  }

  loadOptions = (input, callback) => {

    const value = input.trim();
    this.finalValue = value;

    setTimeout(() => {
      if (this.finalValue === value) {
        if (value.length > 0) {
          seafileAPI.searchUsers(value).then((res) => {
            this.options = [];
            this.options.push({'value': value, 'label': value});
            for (let i = 0 ; i < res.data.users.length; i++) {
              const item = res.data.users[i];
              let obj = {};
              obj.value = item.email;
              obj.label = item.nick_name;
              this.options.push(obj);
            }
            callback(this.options);
          }).catch(error => {
            let errMessage = Utils.getErrorMsg(error);
            toaster.danger(errMessage);
          });
        }
      }
    }, 1000);
  }

  handleFieldChange = (selectedOption) => {
    this.setState({ field: selectedOption ? selectedOption.value : '' }, () => {
      let filter = {
        "field": this.state.field,
        "operation": this.state.opeartion,
        "value": this.state.value,
        "uniqueID": this.props.uniqueID,
      }
      this.props.onSelectedValueChange(filter);
    });
  };

  handleOpeartionChange = (selectedOption) => {
    this.setState({ opeartion: selectedOption ? selectedOption.value : '' }, () => {
      let filter = {
        "field": this.state.field,
        "operation": this.state.opeartion,
        "value": this.state.value,
        "uniqueID": this.props.uniqueID,
      }
      this.props.onSelectedValueChange(filter);
    });
  };

  handleValueChange = (selectedOption) => {
    this.setState({ value: selectedOption ? selectedOption.value : '' }, () => {
      let filter = {
        "field": this.state.field,
        "operation": this.state.opeartion,
        "value": this.state.value,
        "uniqueID": this.props.uniqueID,
      }
      this.props.onSelectedValueChange(filter);
    });
  };

  render() {
    const searchValue = this.state.searchValue;
    const style = { margin: '6px 10px', textAlign: 'center', color: 'hsl(0,0%,50%)' };

    const logic = [
      { value: 'and', label: 'and' },
      { value: 'or', label: 'or' },
    ];
    const fields = [
      { value: 'uid', label: 'uid' },
      { value: 'work_no', label: 'work_no' },
      { value: 'emp_name', label: 'emp_name' },
      { value: 'nick_name', label: 'nick_name' },
      { value: 'dept_name', label: 'dept_name' },
      { value: 'dept_name_en', label: 'dept_name_en' },
    ];
    const opeartions = [
      { value: 'equal', label: 'equal' },
      { value: 'not-equal', label: 'not-equal' },
      { value: 'contains', label: 'contains' },
      { value: 'not-contains', label: 'not-contains' },
      { value: 'startswith', label: 'startswith' },
    ];

    return (
      <div style={{ display: 'flex', marginBottom: '8px' }}>
        {
          this.props.uniqueID == 'first one' ?
          <div style={{ width: '20px'}}></div>
          :
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '20px',
            cursor: 'pointer'
          }} onClick={this.props.onCloseClick}>
            &#10006;
          </div>
        }
        {
          this.props.uniqueID == 'first one' ?
          <div style={{ width: '85px'}}>
            <Select isDisabled />
          </div>
          :
          <div style={{ width: '85px'}}>
            <Select
              options={logic}
              placeholder={'And'}
            />
          </div>
        }
        <div style={{ flex: 1 }}>
          <Select
            options={fields}
            onChange={this.handleFieldChange}
            value={fields.find(field => field.value === this.props.field)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Select
            options={opeartions}
            onChange={this.handleOpeartionChange}
            value={opeartions.find(opeartion => opeartion.value === this.props.opeartion)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <AsyncSelect
            isClearable
            loadOptions={this.loadOptions}
            placeholder="Input to select"
            onChange={this.handleValueChange}
            value={{'value': this.props.value, 'label': this.props.value}}
          />
        </div>
      </div>
    );
  }
}

AlibabaUserSetSelect.propTypes = propTypes;

export default AlibabaUserSetSelect;
