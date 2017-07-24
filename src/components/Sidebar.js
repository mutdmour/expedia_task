import React from 'react';

/**
 * Filter side bar.
 * props:
 *  updateParams function to update params state of a certain key
 *  params: current params state
 *  clearParams: function to clear params from state
 */
export default class Sidebar extends React.Component {

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
        var destiantionParam;
        if (params.productType == "Hotel"){
            destiantionParam = "destinationName";
            starInput =  ( <div>
                {this.renderStarsInput("minStarRating", "Min Star Rating", this.props.updateParams, params.minStarRating)}
                {this.renderStarsInput("minGuestRating", "Min Guest Rating", this.props.updateParams, params.minGuestRating)}
                </div>)
        } else {
            destiantionParam = "destinationCity";
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
                  <label htmlFor="destination">Destination:</label>
                  <input type="text" 
                        id="destination"
                        className="form-control" 
                        placeholder="Amman" 
                        value={params[destiantionParam]} 
                        onKeyPress={(e) => this.handleKeyPress(e, destiantionParam)}
                        onChange={(e) => this.props.updateParams(e,destiantionParam)}
                        aria-describedby="basic-addon1"></input>
                </div>

                <div className="input-group">
                  <label htmlFor="lengthofstay">Length Of Stay:</label>
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

    //XXX bind updateParams instead of passing it
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
            return ( <div key={i} onClick={(e) => updateParams(e,key,true, val)} className="pointer">
                        {div.map(function(star, j){
                            return <div key={j} className="star">{star}</div>;
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