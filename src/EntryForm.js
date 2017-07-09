import React, { Component } from 'react';
import { Form, FormGroup, Label, Button, UncontrolledButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem, InputGroup, InputGroupAddon, InputGroupButton, Input } from 'reactstrap';
import Moment from 'moment';
import uuidv4 from 'uuid/v4';

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
      restaurant: '',
      date: Date.now(),
      entryItems: [ {
        id: uuidv4(),
        buddy: '',
        dish: '',
        price: ''
      }],
      adjustments: [
        {
          id: uuidv4(),
          type: 'discount',
          unit: 'inDollar',
          value: '',
          enabled: false
        },
        {
          id: uuidv4(),
          type: 'serviceCharge',
          unit: 'inPercent',
          value: 10,
          enabled: false
        },
      ]
    };
    this.state = initialState;
  }

  handleFormChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const field = target.name;
    this.setState({
      [field]: value
    });
  }

  addNewEntryItem() {
    const entryItems = this.state.entryItems.slice();
    entryItems.push({
      'id': uuidv4(),
      'buddy': '',
      'dish': '',
      'price': ''
    });
    this.setState({ entryItems: entryItems });
  }

  handleItemChange(i, field, value) {
    const entryItems = this.state.entryItems.slice();
    const updatedEntryItems = Object.assign({}, entryItems[i]);
    updatedEntryItems[field] = value;
    entryItems[i] = updatedEntryItems;
    this.setState({ entryItems: entryItems });
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

  removeEntryItem(i) {
    if (this.state.entryItems.length > 1) {
      const entryItems = this.state.entryItems.slice();
      entryItems.splice(i, 1)
      this.setState({ entryItems: entryItems });
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
            <Input id="restaurant" type="text" value={this.state.restaurant} name="restaurant" onChange={this.handleFormChange}/>
          </div>
        </FormGroup>
        <FormGroup row>
          <div className="col-4">
            <Label for="date">Date</Label>
          </div>
          <div className="col-8">
            <Input id="date" type="text" value={Moment(this.state.date).format('YYYY-MM-DD')} name="date" onChange={this.handleFormChange}/>
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
      <div key={adjustment.id}>
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
    var total = this.state.entryItems
      .map(item => item.price || 0)
      .reduce((x1, x2) => x1 + x2);
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
                    <Input  type="number" step="any" readOnly value={total}/>
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
        {this.state.entryItems.map((entryItem, i) => (
          <EntryFormItem key={entryItem.id}
            buddy={entryItem.buddy}
            dish={entryItem.dish}
            price={entryItem.price}
            onBuddyChange={(value) => this.handleItemChange(i, 'buddy', value)}
            onDishChange={(value) => this.handleItemChange(i, 'dish', value)}
            onPriceChange={(value) => this.handleItemChange(i, 'price', Number(value))}
            onRemove={() => this.removeEntryItem(i)}/>
        ))}
        <div className="text-center">
          <Button color="link" onClick={() => this.addNewEntryItem()}>
            <span className="fa fa-plus"/> Add
          </Button>
        </div>
        <div className="card-block">
          {this.renderBillAdjustments()}
          {this.renderSummary()}
          <div className="text-right">
            <Button color="primary">Publish</Button>
          </div>
        </div>
      </div>
    );
  }

}


class EntryFormItem extends Component {

  render() {
    return (
      <div className="MoneyIO-entry-form-item">
        <div className="row">
          <div className="col-7">
            <div className="form-group">
              <Input type="text" value={this.props.buddy} placeholder="Who?" onChange={(event) => this.props.onBuddyChange(event.target.value)}/>
            </div>
          </div>
          <div className="col-5 text-right">
            <Button color="link" className="MoneyIO-entry-form-item-close-button" onClick={this.props.onRemove}>
              <span className="fa fa-remove"/>
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-7">
            <div className="form-group">
              <Input type="text" value={this.props.dish} placeholder="What?" onChange={(event) => this.props.onDishChange(event.target.value)}/>
            </div>
          </div>
          <div className="col-5">
            <div className="MoneyIO-entry-from-price-field">
              <InputGroup>
                <InputGroupAddon><span className="fa fa-usd"/></InputGroupAddon>
                <Input type="number" step="any" defaultValue={this.props.price} placeholder="Price?" onChange={(event) => this.props.onPriceChange(event.target.value)}/>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default EntryForm;