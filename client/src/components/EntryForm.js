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

class EntryForm extends Component {

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
  }

  publishReceipt() {
    this.props.onReceiptPublish(this.props.receipt);
  }

  handleFieldUpdate(field, value) {
    if (this.props.onReceiptUpdate) {
      this.props.onReceiptUpdate({
        ...this.props.receipt,
        [field]: value
      });
    }
  }

  addNewEntryItem() {
    if (this.props.onReceiptUpdate) {
      this.props.onReceiptUpdate({
        ...this.props.receipt,
        items: [ ...this.props.receipt.items, {} ]
      });
    }
  }

  handleItemUpdate(i, item) {
    const items = this.props.receipt.items;
    items[i] = item;
    if (this.props.onReceiptUpdate) {
      this.props.onReceiptUpdate({
        ...this.props.receipt,
        items: items
      });
    }
  }

  removeEntryItem(i) {
    if (this.props.receipt.items.length > 1) {
      const items = this.props.receipt.items.slice();
      items.splice(i, 1);

      if (this.props.onReceiptUpdate) {
        this.props.onReceiptUpdate({
          ...this.props.receipt,
          items: items
        });
      }
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
    Moment.locale('en');
    return (
      <Form>
        <FormGroup row>
          <div className="col-4">
            <Label for="restaurant">Restaurant</Label>
          </div>
          <div className="col-8">
            <Input id="restaurant" type="text" value={this.props.receipt.restaurant} name="restaurant" onChange={(event) => this.handleFieldUpdate('restaurant', event.target.value)}/>
          </div>
        </FormGroup>
        <FormGroup row>
          <div className="col-4">
            <Label for="date">Date</Label>
          </div>
          <div className="col-8">
            <Input id="date" type="text" value={Moment(this.props.receipt.time).format('YYYY-MM-DD')} name="date" onChange={(event) => this.handleFieldUpdate('time', event.target.value)}/>
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
    let total = this.props.receipt.items
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
                  <Label>Total</Label>
                </div>
                <div className="col-9">
                  <InputGroup>
                    <InputGroupAddon><span className="fa fa-usd"/></InputGroupAddon>
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
      <div className="card">
        <div className="card-block">
          {this.renderBasicInfo()}
        </div>
        {this.props.receipt.items.map((item, i) => (
          <EntryFormItem key={i} item={item}
            onItemUpdate={(item) => this.handleItemUpdate(i, item)}
            onRemove={() => this.removeEntryItem(i)}/>
        ))}
        <div className="text-center">
          <Button id="add-entry-item-button" color="link" onClick={() => this.addNewEntryItem()}>
            <span className="fa fa-plus"/> Add
          </Button>
        </div>
        <div className="card-block">
          {this.renderBillAdjustments()}
          {this.renderSummary()}
          <div className="text-right">
            <Button color="primary" disabled={this.props.publishingTransaction} onClick={(event) => this.publishReceipt()}>Publish</Button>
          </div>
        </div>
      </div>
    );
  }

}

export default EntryForm;