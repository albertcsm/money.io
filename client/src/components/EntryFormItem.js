import React, { Component } from 'react';

import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';

class EntryFormItem extends Component {

  handleFieldUpdate(field, value) {
    if (this.props.onItemUpdate) {
      this.props.onItemUpdate({
        ...this.props.item,
        [field]: value
      });
    }
  }

  render() {
    return (
      <div className="MoneyIO-entry-form-item">
        <div className="row">
          <div className="col-7">
            <div className="form-group">
              <Input type="text" value={this.props.item.buddyUserName} placeholder="Who?" onChange={(event) => this.handleFieldUpdate('buddyUserName', event.target.value)}/>
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
              <Input type="text" value={this.props.item.description} placeholder="What?" onChange={(event) => this.handleFieldUpdate('description', event.target.value)}/>
            </div>
          </div>
          <div className="col-5">
            <div className="MoneyIO-entry-from-price-field">
              <InputGroup>
                <InputGroupAddon><span className="fa fa-usd"/></InputGroupAddon>
                <Input type="number" step="any" defaultValue={this.props.item.amount} placeholder="Price?" onChange={(event) => this.handleFieldUpdate('amount', event.target.value)}/>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default EntryFormItem;