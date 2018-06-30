import React from 'react';

import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { formProviders } from '../configs';

class FormTypeSelector extends React.Component {

  render() {
    return (
      <UncontrolledDropdown>
        <DropdownToggle color="secondary" outline caret disabled={this.props.disabled}>
          {formProviders.find(p => p.key === this.props.selectedType).name}
        </DropdownToggle>
        <DropdownMenu>
          {formProviders.map(formProvider => (
            <DropdownItem key={formProvider.key} onClick={() => this.props.onChange(formProvider.key)}>{formProvider.name}</DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }

}

export default FormTypeSelector;