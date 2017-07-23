const expedia = require('../../expedia.js');
import expect from 'expect';

//XXX more testing of module needed

describe('Expedia module', () => {

  it('should render handle the hotel request successfully', () => {
    	var url  = "/api/getOffers?productType=Hotel&destinationName=amman&lengthOfStay=2&minStarRating=4&minGuestRating=3";
    	var req = {url:url};
      var desired = { lengthOfStay: '2',
                      destinationName: 'amman',
                      minStarRating: '4',
                      minGuestRating: '3',
                      productType: 'Hotel' }

      expedia._handleRequest(req, function(err, query){
        if (query){
          expect(query).toEqual(desired);
        }
      });
  });

  it('should render handle the flight request successfully, removing away extraneous params', () => {
      var url  = "/api/getOffers?productType=Flight&destinationName=amman&lengthOfStay=2&minStarRating=4&minGuestRating=3";
      var req = {url:url};
      var desired = { lengthOfStay: '2',
                      destinationName: 'amman',
                      productType: 'Flight' }

      expedia._handleRequest(req, function(err, query){
        if (query){
          expect(query).toEqual(desired);
        }
      });
  });

  it('should render handle the flight request successfully, removing empty params', () => {
      var url  = "/api/getOffers?productType=Flight&destinationName=&lengthOfStay=&minStarRating=&minGuestRating=";
      var req = {url:url};
      var desired = { productType: 'Flight' }

      expedia._handleRequest(req, function(err, query){
        if (query){
          expect(query).toEqual(desired);
        }
      });
  });

});
