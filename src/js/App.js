import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage';


/*
let prev = {
    long: undefined,
    lat: undefined,
    time: undefined
};


let curr = {
    long: undefined,
    lat: undefined,
    time: undefined
};

let generalInfo = {
    prev: prev,
    current: curr,
    overallDistance: 0,

    setNext: function(position, timestamp){

    }
};
*/



class Section1 extends React.Component{
    render(){
        return ( <div>
            <p>latitude: {this.props.issPosition.latitude}</p>
            <p>longitude: {this.props.issPosition.longitude}</p>
            </div>)
    }
}

class Fullpage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isError: false,  //rozwinac to jak bedzie blad
            issPosition: {},
        }
    }

    render(){
        return <div className="background-sky">
            <ReactFullpage
                render={({ state, fullpageApi }) => {
                    return (
                        <ReactFullpage.Wrapper>

                                <div className="section first">

                                    <i className="fas fa-user-astronaut"> </i>
                                    <h1>INTERNATIONAL SPACE STATION</h1>
                                    <p>Humankind’s Remarkable Achievement and World-Class Laboratory. Where it is now? </p>
                                    <button onClick={() => fullpageApi.moveSectionDown()}>

                                        <p>scroll down</p>
                                        <i className="fas fa-angle-double-down"> </i>

                                    </button>

                                </div>

                                <div className="section second">

                                    <div className="rocket">
                                        <i className="fas fa-space-shuttle"> </i>
                                    </div>
                                    <Section1 issPosition={this.state.issPosition}/>
                                    <p>z jaka predkoscia porusza sie ISS? (cyferki rosna az do momentu kiedy osiągną odpowiednią liczbę)</p>
                                    <p>jaką drogę przebyła ISS od początku zapisanych odczytów?</p>
                                    <button onClick={this.getISS}> REFRESH </button>

                                    <button onClick={this.getDistance}>oblicz dystans</button>
                                    <button onClick={this.getSpeed}>oblicz prędkość</button>
                                </div>

                        </ReactFullpage.Wrapper>
                    );
                }}
            />
        </div>
    }

    componentDidMount() {
        this.getISS();
    };

    getISS = () => {
        fetch('http://api.open-notify.org/iss-now.json')
            .then(issPosition => {
                if (issPosition.ok){
                    return issPosition.json()
                } else {
                    this.setState({
                        isError: true
                    })
                }
            })
            .then(issPositionJSON => {

                //generalInfo.setNext(issPositionJSON.iss_position, issPositionJSON.timestamp);

                this.setState({
                    issPosition: issPositionJSON.iss_position,
                    //generalInfo: generalInfo,
                });
            })
            .catch(()=>{this.setState({isError: true})})
    };

    getDistance = () => {

    };

    getSpeed = () => {

    };
SPEED            //     points = [{lat: .., lng: ..}, ... ]; // 6 points
                // distancesSum = 0;
                // for(i = 0; i < distances.length - 1; i++) {
                //     distancesSum += distance(points[i], points[i + 1]);
                // }
                // return (distancesSum / (points.length - 1));

    // function distance(point1, point2) {
    //     var degToRad = Math.PI / 180;
    //     return R * degToRad * Math.sqrt(Math.pow(Math.cos(point1.lat * degToRad ) * (point1.lng - point2.lng) , 2) + Math.pow(point1.lat - point2.lat, 2));
    // }

    // R = 6371000;// meters Earth radius


}

class App extends React.Component {
    render() {
        return (
            <Fullpage/>
        );
    }
}

export default App
