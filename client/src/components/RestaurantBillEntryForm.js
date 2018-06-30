import React, { Component } from 'react';

import { Form, FormGroup, Label, Button, UncontrolledButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem, InputGroup, InputGroupAddon, InputGroupButton, Input } from 'reactstrap';
import Moment from 'moment';

import EntryFormItem from './EntryFormItem';

const translations = {
  discount: 'Discount',
  serviceCharge: 'Service charge',
  inDollar: 'dollars',
  inPercent: 'percent'
};

class RestaurantBillEntryForm extends Component {

  constructor() {
    super();
    const initialState = {
      adjustments: [
        // {
        //   id: uuidv4(),
        //   type: 'discount',
        //   unit: 'inDollar',
        //   value: '',
        //   enabled: false
        // },
        // {
        //   id: uuidv4(),
        //   type: 'serviceCharge',
        //   unit: 'inPercent',
        //   value: 10,
        //   enabled: false
        // },
      ]
    };
    this.state = initialState;
    Moment.locale('en');
  }

  publish() {
    this.props.onPublish(this.props.formData);
  }

  handleFieldUpdate(field, value) {
    this.props.onUpdate({
      ...this.props.formData,
      [field]: value
    });
  }

  addNewEntryItem() {
    const newItem = {
      'buddyUserName': '',
      'buddyUserId': null
    };

    this.props.onUpdate({
      ...this.props.formData,
      items: [ ...this.props.formData.items, newItem ]
    });
  }

  handleItemUpdate(i, item) {
    const items = this.props.formData.items;
    items[i] = item;

    this.props.onUpdate({
      ...this.props.formData,
      items: items
    });
  }

  removeEntryItem(i) {
    if (this.props.formData.items.length > 1) {
      const items = this.props.formData.items.slice();
      items.splice(i, 1);

      this.props.onUpdate({
        ...this.props.formData,
        items: items
      });
    }
  }

  setAdjustmentOption(id, field, value) {
    var index = this.state.adjustments.findIndex((adjustment) => adjustment.id === id);
    if (index !== -1) {
      var newAdjustment = Object.assign({}, this.state.adjustments[index]);
      newAdjustment[field] = value;
      if (field === 'unit') {
        newAdjustment.value = '';
      }
      var newAdjustments = this.state.adjustments.slice();
      newAdjustments[index] = newAdjustment;
      this.setState({ adjustments: newAdjustments });
    }
  }

  renderBasicInfo() {
    return (
      <Form>
        <FormGroup row>
          <div className="col-4">
            <Label for="title" className="MoneyIO-form-label">Restaurant</Label>
          </div>
          <div className="col-8">
            <Input id="title" type="text" value={this.props.formData.title} name="title" onChange={(event) => this.handleFieldUpdate('title', event.target.value)}/>
          </div>
        </FormGroup>
      </Form>
    );
  }

  renderBillAdjustments() {
    return (
      <div>
        {this.state.adjustments.map((adjustment, i) => this.renderBillAdjustment(adjustment))}
      </div>
    );
  }

  renderBillAdjustment(adjustment) {
    let adjustmentOptions = null;
    if (adjustment.enabled) {
      adjustmentOptions = (
        <Form inline>
          <InputGroup>
            <Input type="number" value={adjustment.value} onChange={(event) => this.setAdjustmentOption(adjustment.id, 'value', event.target.value)}/>
            <InputGroupButton>
              <UncontrolledButtonDropdown>
                <DropdownToggle caret>
                  {translations[adjustment.unit]}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => this.setAdjustmentOption(adjustment.id, 'unit', 'inDollar')}>dollars</DropdownItem>
                  <DropdownItem onClick={() => this.setAdjustmentOption(adjustment.id, 'unit', 'inPercent')}>percent</DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </InputGroupButton>
          </InputGroup>
        </Form>
      );
    }
    return (
      <div key={adjustment.id} className="MoneyIO-bill-adjustment-item">
        <FormGroup check>
          <Label check>
            <Input type="checkbox" checked={adjustment.enabled} onClick={() => this.setAdjustmentOption(adjustment.id, 'enabled', !adjustment.enabled)}/> {translations[adjustment.type]}
          </Label>
          {adjustmentOptions}
        </FormGroup>
      </div>
    );
  }

  renderSummary() {
    let total = this.props.formData.items
      .map(item => item.amount || 0)
      .reduce((x1, x2) => Number(x1) + Number(x2), 0);
    this.state.adjustments.forEach(adjustment => {
      if (adjustment.enabled) {
        var sign = 0;
        if (adjustment.type === "discount") {
          sign = -1;
        } else if (adjustment.type === "serviceCharge") {
          sign = 1;
        }
        if (adjustment.unit === "inDollar") {
          total += sign * adjustment.value;
        } else if (adjustment.unit === "inPercent") {
          total += total * sign * adjustment.value / 100;
        }
      }
    });

    return (
      <div className="MoneyIO-summary">
        <div className="row">
          <div className="offset-4 col-8">
            <Form>
              <FormGroup row>
                <div className="col-3">
                  <Label className="MoneyIO-form-label">Total</Label>
                </div>
                <div className="col-9">
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input id="total" type="number" step="any" readOnly value={total}/>
                  </InputGroup>
                </div>
              </FormGroup>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderBasicInfo()}

        {this.props.formData.items.map((item, i) => (
          <EntryFormItem key={i} item={item} buddyList={this.props.buddyList}
            onItemUpdate={(item) => this.handleItemUpdate(i, item)}
            onRemove={() => this.removeEntryItem(i)}/>
        ))}

        <div className="text-center ">
          <Button id="add-entry-item-button" color="link" onClick={() => this.addNewEntryItem()}>
            <span className="fa fa-plus"/> Add
          </Button>
        </div>
      
        {this.renderBillAdjustments()}
        {this.renderSummary()}
        <div className="clearfix">
          { this.props.formData.time &&
              <div className="float-left">
                <label className="font-weight-light">
                  Published on {Moment(this.props.formData.time).format('YYYY-MM-DD h:mm a')}
                </label>
              </div>
            }
          <div className="text-right">
            <Button color="primary" disabled={this.props.publishingTransaction} onClick={(event) => this.publish()}>Publish</Button>
          </div>
        </div>
      </div>
    );
  }

}

export default RestaurantBillEntryForm;