const expedia = require('../../expedia.js');
import expect from 'expect';
import { shallow } from 'enzyme';

//XXX more testing of module needed

describe('Expedia module', () => {

	var url  = "/api/getOffers?productType=Hotel&destinationName=amman&lengthOfStay=2&minStarRating=4&minGuestRating=3";
	var req = {url:url};
  // it('should render the App component', () => {
  //   const wrapper = shallow(
  //     <App/>
  //   );

  //   expect(wrapper.find('h3').text()).toEqual('Deal Finder');
  // });

  // it('should run a solid smoke test', () => {
    expect(true).toEqual(true);
  // });
});
