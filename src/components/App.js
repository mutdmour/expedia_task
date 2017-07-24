import React from 'react';
var $ = require("jquery");
var querystring = require("querystring")

import '../assets/stylesheets/base.scss';
import Sidebar from './Sidebar.js';
import Offer from './Offer.js';


/**
 * Main App module.
 */
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
        $.ajax({ url: '/api/getOffers?'+params, method: 'GET', dataType: 'json' })
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
                    <h3 id="title">Deal finder</h3>
                    <Sidebar params={this.state.params} 
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
                            this.state.offers.map(function(offer,i) {
                                return <Offer offer={offer} key={i}/>
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
        // if (!type){
            params.minGuestRating = null;
            params.minStarRating = null;
            params.destinationName = "";
            params.lengthOfStay = "";
            params.destinationCity = "";
        // } else if (type === "Hotel"){
        //     params.minGuestRating = null;
        //     params.minStarRating = null;
        // } else {
        //     params.destinationCity = "";
        // }
        this.setState({params:params});
        this.getData(this);
    }
}