import React from 'react';
import ReactDOM from 'react-dom';
// import axios from 'axios';
import PropTypes from 'prop-types';
var $ = require("jquery");
var querystring = require("querystring")

import '../assets/stylesheets/base.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            offers: [],
            params: {},
        };
    }

    componentDidMount() {
        params = querystring.stringify(this.state.params);
        console.log(params)
        $.ajax({ url: 'http://127.0.0.1:8080/sup?'+params, method: 'GET', dataType: 'json' })
            .done((data) => {
                this.setState({ 
                    offers: data['data'],
                    loading:true
                })
            })
    }

    render() {
        return ( 
            <div>
                <Header updateFilters={updateFilters=this.updateFilters}/> 
                {
                    this.state.offers.map(function(offer) {
                        return <Offer offer={offer} / >
                    })
                } 
            </div>
        )
    }

    updateFilters(params){
        this.setState(params)
    }
}

class Header extends React.Component {
    render() {
        return (
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Amman" aria-describedby="basic-addon1"></input>
            </div>
        )
    }
}

class Offer extends React.Component {
    render() {
        var offer = this.props.offer;
        var hotelName = offer.hotelInfo.hotelName;
        return <div > Hello { hotelName } < /div>;
    }
}

// const App = ({ data }) => {
//     return <HelloMessage / >


// };

// App.propTypes = {
//     name: PropTypes.array,
// };

export default App;