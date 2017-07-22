import {decodeURI} from './helpers.js';
import React from 'react';
var moment = require("moment");


/**
 * Offer row. 
 * props:
 *  offer: object to display whether hotel or flight
 *  key: iterator key
 */
export default class Offer extends React.Component {
    render() {
        var offer = this.props.offer;
        if (offer.flightInfo){
            var flightInfo = offer.flightInfo;
            var flightPricingInfo = offer.flightPricingInfo;
            var offerDateRange = offer.offerDateRange;
            function formatDate(d){
                return moment(d).format("MMM DD YYYY");
            }
            return (
                <tr key={this.props.key}>
                    <div className="row offer_row">
                        <div className="col-xs-4 col-md-3 offer_price">
                            <h4>{flightPricingInfo.flightPerPsgrTotalPrice} </h4>
                            <h5>{flightPricingInfo.currencyCode}</h5>
                        </div>
                        <div className="col-xs-8 col-md-9 offer_row">
                            <div className="row">
                                <div>
                                    <a href={decodeURI(offer.flightUrls.flightSearchUrl)}>{offer.origin.city} TO {offer.destination.city} {flightInfo.tripType === "ROUND_TRIP"? "AND BACK":""}</a>
                                </div>
                                <div>
                                    Offer valid {formatDate(offerDateRange.travelStartDate)} through {formatDate(offerDateRange.travelEndDate)}
                                </div>
                                <div>
                                    {flightInfo.flightDealCarrierName}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        
                    </div>
                </tr>
            )
        } else if (offer.hotelInfo) {
            var hotelInfo = offer.hotelInfo;
            var hotelUrls = offer.hotelUrls;
            var hotelPricingInfo = offer.hotelPricingInfo;
            return (
                <tr>
                    <div className="row offer_row">
                        <div className="col-md-2 offer_price">
                            <h4>{hotelPricingInfo.originalPricePerNight} </h4>
                            <h5>{hotelPricingInfo.currency} PER NIGHT</h5>
                        </div>
                        <div className="col-xs-2 col-md-2 hotel_image">
                            <a href={decodeURI(hotelUrls.hotelInfositeUrl)} className="pointer"><img src={hotelInfo.hotelImageUrl}></img></a>
                        </div>
                        <div className="col-xs-10 col-md-8">
                            <div className="row">
                                <div className="col-xs-2 col-md-4">
                                    <a href={decodeURI(hotelUrls.hotelInfositeUrl)}>{hotelInfo.hotelName}</a>
                                </div>
                                <div className="col-xs-10 col-md-8">
                                    {this.renderStars(parseFloat(hotelInfo.hotelStarRating))}
                                </div>
                            </div>
                            <p>{hotelInfo.description}</p>
                        </div>
                    </div>
                    <div className="row">
                        
                    </div>
                </tr>
            )
        }
        return <tr className="hidden"></tr>
    }

    renderStars(rating){
        var star = <span className="glyphicon glyphicon-star" aria-hidden="true"></span>;
        var star_empty = <span className="glyphicon glyphicon-star-empty" aria-hidden="true"></span>;
        var stars = [];
        for (var j=1; j<6; j++){
            if (j < rating){
                stars.push(star);
            } else {
                stars.push(star_empty);
            }
        }
        return <div>
                    {stars.map(function(star, i){
                        return <div className="star" key={i}>{star}</div>;
                    })}
                </div>
    }
}