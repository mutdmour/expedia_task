import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import App from '../../src/components/App';
import Sidebar from '../../src/components/Sidebar';
import Offer from '../../src/components/Offer';
import {flightOffer} from './exampleOffer.js';

//XXX more testing needed

describe('Component: App', () => {
  it('should render the App component', () => {
    const wrapper = shallow(
      <App/>
    );
    expect(wrapper.find('h3').text()).toEqual('Deal finder');
  });
});

describe('Component: Sidebar', () => {
  it('should render the Sidebar component', () => {
  	var params = {productType:"Hotel"};
    const wrapper = shallow(
      <Sidebar params={params}/>
    );
    expect(wrapper.find('button').length).toEqual(2);
  });
});

describe('Component: Offer', () => {
  it('should render the Offer component', () => {
    const wrapper = shallow(
      <Offer offer={flightOffer}/>
    );
    expect(wrapper.find('h5').text()).toEqual('USD');
  });
});