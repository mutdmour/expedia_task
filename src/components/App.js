import React from 'react';
import ReactDOM from 'react-dom';
// import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, DropdownButton, MenuItem} from 'react-bootstrap';

var $ = require("jquery");
var moment = require("moment");
var querystring = require("querystring")

import '../assets/stylesheets/base.scss';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            offers: [],
            params: {
                productType:"Hotel"
            },
        };
        this.updateParams = this.updateParams.bind(this);
        this.clearParams = this.clearParams.bind(this);
    }

    componentDidMount() {
        this.getData(this);
    }

    getData(scope){
        this.setState({loading:true})
        var params = querystring.stringify(scope.state.params);
        $.ajax({ url: 'http://127.0.0.1:8080/getOffers?'+params, method: 'GET', dataType: 'json' })
            .done((data) => {
                data = data['data']? data['data'][scope.state.params.productType]: [];
                scope.setState({ 
                    offers: data,
                    loading:false
                })
            })
    }

    render() {
        return ( 
            <div className="row ">
                <div className="col-xs-2 col-md-2 side_bar">
                    <h3>Deal finder</h3>
                    <Header params={this.state.params} 
                            updateParams={this.updateParams} 
                           clearParams={()=>this.clearParams()}
                            /> 
                </div>
                <div className="col-xs-10 col-md-10">
                    {this.renderOffers()}
                </div>
            </div>
        )
    }

    renderOffers(){
        if (this.state.loading){
            return (<div className="loader"></div>)
        } else if (this.state.offers){
            var offers = this.state.offers;
            return (
                <table className="table table-striped">
                    <tbody>
                        {
                            this.state.offers.map(function(offer) {
                                return <Offer offer={offer} />
                            })
                        }
                    </tbody>
                </table>
            )
        }
        return <h5 className="offer_row">No offers were found</h5>;
    }

    updateParams(event, key, getData, val=null){
        var params = this.state.params;
        if (!val){
            var val = $(event.currentTarget).val();
        }
        params[key] = val;
        this.setState({params: params})
        if (getData){
            if (key == "productType"){
                if (val == "Flight"){
                    this.clearParams("Hotel");
                } else {
                    this.clearParams("Flight");
                }
            } else {
                this.getData(this);
            }
        }
    }

    clearParams(type){
        var params = this.state.params;
        if (!type){
            params.minGuestRating = null;
            params.minStarRating = null;
            params.destinationName = "";
            params.lengthOfStay = "";
        } else if (type === "Hotel"){
            params.minGuestRating = null;
            params.minStarRating = null;
        }
        this.setState({params:params});
        this.getData(this);
    }
}

class Header extends React.Component {

    constructor(props){
        super(props);
        // this.renderStarsInput = this.renderStarsInput.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(e, key){
        if (e.key === 'Enter'){
            this.props.updateParams(e,key,true);
        }
    }

    render() {
        var params = this.props.params;

        var isActive = function(opt){
            return opt === params.productType? "active": "";
        }

        var starInput = <div className="hidden"></div>
        if (params.productType == "Hotel"){
            starInput =  ( <div>
                {this.renderStarsInput("minStarRating", "Min Star Rating", this.props.updateParams, params.minStarRating)}
                {this.renderStarsInput("minGuestRating", "Min Guest Rating", this.props.updateParams, params.minGuestRating)}
                </div>)
        }

        return (
            <div>
                <div className="input-group" role="group" aria-label="...">
                  <button type="button" 
                            className={"btn btn-default " + isActive("Hotel")}
                            value="Hotel" 
                            onClick={(e) => this.props.updateParams(e,"productType",true)}
                            >Hotels</button>
                  <button type="button" 
                            className={"btn btn-default " + isActive("Flight")}
                            value="Flight" 
                            onClick={(e) => this.props.updateParams(e,"productType",true)}
                            >Flights</button>                
                </div>

                <div className="input-group">
                  <label for="destination">Destination:</label>
                  <input type="text" 
                        id="destination"
                        className="form-control" 
                        placeholder="Amman" 
                        value={params.destinationName} 
                        onKeyPress={(e) => this.handleKeyPress(e, "destinationName")}
                        onChange={(e) => this.props.updateParams(e,"destinationName")}
                        aria-describedby="basic-addon1"></input>
                </div>

                <div className="input-group">
                  <label for="lengthofstay">Length Of Stay:</label>
                  <input type="number" 
                        min="1"
                        id="lengthofstay"
                        className="form-control" 
                        placeholder="-" 
                        value={params.lengthOfStay} 
                        onChange={(e) => this.props.updateParams(e,"lengthOfStay")}
                        onKeyPress={(e) => this.handleKeyPress(e, "lengthOfStay")}
                        aria-describedby="basic-addon1"></input>
                </div>

                {starInput}

                <div className="input-group">
                    <a href="#" onClick={()=>this.props.clearParams()}>Clear all filters</a>
                </div>

            </div>
        )
    }

    renderStarsInput(key, label, updateParams, currentVal){
        var star = <span className="glyphicon glyphicon-star" aria-hidden="true"></span>;
        var star_empty = <span className="glyphicon glyphicon-star-empty" aria-hidden="true"></span>;
        var divs = [];
        for (var i=5; i>0; i--){
            if (!currentVal || currentVal == String(i)){
                var div = [];
                for (var j=1; j<6; j++){
                    if (i < j){
                        div.push(star_empty);
                    } else {
                        div.push(star);
                    }
                }
                divs.push(div)
            }
        }

        var stars = divs.map(function(div, i){
            var val = currentVal? currentVal: 5 - i;
            return ( <div onClick={(e) => updateParams(e,key,true, val)} className="pointer">
                        {div.map(function(star){
                            return star;
                        })}
                        <span>& Up</span>
                </div>
            )
        })

        return (<div className="input-group">
                    <label>{label}:</label>
                    {stars}
                </div>)

    }
}

class Offer extends React.Component {
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
                <tr>
                    <div className="row offer_row">
                        <div className="col-md-2 offer_price">
                            <h4>{flightPricingInfo.flightPerPsgrTotalPrice} </h4>
                            <h5>{flightPricingInfo.currencyCode}</h5>
                        </div>
                        <div className="col-md-10 offer_row">
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
                    {stars.map(function(star){
                        return star;
                    })}
                </div>
    }
}

function decodeURI(url){
    url = querystring.decode(url)
    return Object.keys(url)[0]
}