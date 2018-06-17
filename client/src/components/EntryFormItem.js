import React, { Component } from 'react';

import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import Autosuggest from 'react-autosuggest';

class EntryFormItem extends Component {

  constructor() {
    super();
    this.state = { buddySuggestions: [] };
  }

  handleFieldUpdate(field, value) {
    if (this.props.onItemUpdate) {
      this.props.onItemUpdate({
        ...this.props.item,
        [field]: value
      });
    }
  }

  selectBuddy(userName) {
    const user = this.props.users.find(u => u.name === userName);
    const userId = user ? user.id : null;
    if (this.props.onItemUpdate) {
      this.props.onItemUpdate({
        ...this.props.item,
        buddyUserId: userId,
        buddyUserName: userName
      });
    }
  }

  render() {
    const getSuggestions = value => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
      return this.props.users.filter(user =>
        user.name.toLowerCase() != inputValue && user.name.toLowerCase().indexOf(inputValue) != -1
      );
    };    
    const onSuggestionsFetchRequested = ({value,reason}) => this.setState({ buddySuggestions: getSuggestions(value) });
    const onSuggestionsClearRequested = () => this.setState({ buddySuggestions: [] });
    const shouldRenderSuggestions = () => true;
    const getSuggestionValue = suggestion => suggestion.name;
    const renderSuggestion = suggestion => suggestion.name;

    const theme = {
      input: 'form-control',
      suggestionsContainer: 'dropdown',
      suggestionsContainerOpen: 'show',
      suggestionsList: 'dropdown-menu',
      suggestion: 'dropdown-item',
      suggestionFocused: 'active'
    };
    
    return (
      <div className="MoneyIO-entry-form-item">
        <div className="pull-right">
          <Button color="link" className="MoneyIO-entry-form-item-close-button" onClick={this.props.onRemove}>
            <span className="fa fa-remove"/>
          </Button>
        </div>
        <div className="row">
          <div className="col-7">
            <div className="form-group">
              <Autosuggest theme={theme}
                suggestions={this.state.buddySuggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                shouldRenderSuggestions={shouldRenderSuggestions}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                  placeholder: 'Who?',
                  value: this.props.item.buddyUserName,
                  onChange: (event, {newValue, method}) => this.selectBuddy(newValue)
                }}                
              />
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