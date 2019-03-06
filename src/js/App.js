import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage';


let prev = {
    longitude: 0,
    latitude: 0,
    timestamp: 0
};

let curr = {
    longitude: 0,
    latitude: 0,
    timestamp: 0
};


let generalInfo = {
    prev: prev,
    current: curr,
    overallDistance: 0,

    setNext: function(position, timestamp){
        this.prev = this.current;
        this.current.longitude = position.longitude;
        this.current.latitude = position.latitude;
        this.current.timestamp = timestamp;
        console.log(this.current);
    },

    getDistance: function() {
        return 0;
    },

    getSpeed: function(){
        return 0;
    }
};

function getIss2(){
    return {
        Isss: 0
    }
}
class Section1 extends React.Component{
    render(){
        return ( <div>
            <p>latitude: {this.props.generalInfo.current.latitude}</p>
            <p>longitude: {this.props.generalInfo.current.longitude}</p>
            </div>)
    }
}

class Fullpage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isError: false,  //rozwinac to jak bedzie blad
            generalInfo: generalInfo,
        }
    }

    render(){

        return <div className="background-sky">
            <ReactFullpage
                render={({ state, fullpageApi }) => {
                    return (
                        <ReactFullpage.Wrapper  >

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
                                    <Section1 generalInfo={this.state.generalInfo}/>
                                    <p>TODO: get speed </p>
                                    <p>TODO: get distance</p>
                                    <button onClick={this.getISS}> REFRESH </button>

                                    <button onClick={this.getDistance}>speed</button>
                                    <button onClick={this.getSpeed}>distance</button>
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

                generalInfo.setNext(issPositionJSON.iss_position, issPositionJSON.timestamp);

                this.setState({
                    generalInfo: generalInfo,
                });
            })
            .catch(()=>{this.setState({isError: true})})
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
