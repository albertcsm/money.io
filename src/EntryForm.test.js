import React from 'react';
import ReactDOM from 'react-dom';
import EntryForm from './EntryForm';
import { shallow } from 'enzyme';

test('add and remove entry form item', () => {
  const wrapper = shallow(<EntryForm />);

  wrapper.find('#add-entry-item-button').simulate('click');
  expect(wrapper.update().find('EntryFormItem').length).toEqual(2);

  wrapper.find('EntryFormItem').first().props().onRemove();
  expect(wrapper.update().find('EntryFormItem').length).toEqual(1);
});

test('calculate total of item price', () => {
  const wrapper = shallow(<EntryForm />);

  wrapper.find('#add-entry-item-button').simulate('click');
  expect(wrapper.update().find('EntryFormItem').length).toEqual(2);

  wrapper.find('EntryFormItem').first().props().onPriceChange('12.3');
  wrapper.find('EntryFormItem').last().props().onPriceChange('23.4');
  
  expect(wrapper.update().find('#total').props().value).toBeCloseTo(35.7);
});

test('calculate total with discount and service charge', () => {
  const wrapper = shallow(<EntryForm />);

  wrapper.find('#add-entry-item-button').simulate('click');
  wrapper.update();
  wrapper.find('EntryFormItem').first().props().onPriceChange('12.3');
  wrapper.find('EntryFormItem').last().props().onPriceChange('23.4');
  
  wrapper.find('.MoneyIO-bill-adjustment-item').first().find('Input[type="checkbox"]').props().onClick();
  wrapper.update().find('.MoneyIO-bill-adjustment-item').first().find('Input[type="number"]').simulate('change', { target: { value: '5'}});

  wrapper.find('.MoneyIO-bill-adjustment-item').last().find('Input[type="checkbox"]').props().onClick();
  wrapper.update().find('.MoneyIO-bill-adjustment-item').last().find('Input[type="number"]').simulate('change', { target: { value: '10'}});

  expect(wrapper.update().find('#total').props().value).toBeCloseTo(33.77);
});
