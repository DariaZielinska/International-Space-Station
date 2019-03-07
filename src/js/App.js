import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage';
import Timestamp from 'react-timestamp';

let prev = {
    longitude: 0,
    latitude: 0,
    timestamp: 0,
};

let curr = {
    longitude: 0,
    latitude: 0,
    timestamp: 0,
};

let generalInfo = {
    prev: prev,
    current: curr,
    distanceBetweenTwo: 0,
    overallDistance: 0,
    speed: 0,

    setNext: function(position, timestamp){

        //change current data to previous data
        this.prev.longitude = this.current.longitude;
        this.prev.latitude = this.current.latitude;
        this.prev.timestamp = this.current.timestamp;

        //do actualization of current data
        curr.longitude = position.longitude;
        curr.latitude = position.latitude;
        curr.timestamp = timestamp;

        if(this.prev.timestamp === 0 ){
            return null;
        }else{
            this.calculateDistance();
            this.calculateSpeed();
        }
    },

    calculateDistance: function() {
        const degToRad = Math.PI / 180;
        const R = 6371; // km Earth radius
        let distance = R * degToRad * Math.sqrt(Math.pow(Math.cos(this.prev.latitude * degToRad ) * (this.prev.longitude - this.current.longitude) , 2) + Math.pow(this.prev.latitude - this.current.latitude, 2));
        this.distanceBetweenTwo = distance;
        this.overallDistance =  this.overallDistance + Math.floor(distance);
    },

    calculateSpeed: function(){
        this.speed = Math.round((this.distanceBetweenTwo / (this.current.timestamp - this.prev.timestamp)) * 100) / 100;
    },
};

class Section1 extends React.Component{

    render(){
        return ( <div>
                    <p>latitude: {this.props.generalInfo.current.latitude}</p>
                    <p>longitude: {this.props.generalInfo.current.longitude}</p>
                    <Timestamp time={this.props.generalInfo.current.timestamp} format='full'/>
                </div>)
    }
}

class Fullpage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isError: false,  //rozwinac to jak bedzie blad
            all: generalInfo,
            isOk: false,
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
                                    <p>Humankind’s Remarkable Achievement and World-Class Laboratory. <strong>Where it is now?</strong> </p>
                                    <button onClick={() => fullpageApi.moveSectionDown()}>
                                        <p>scroll down</p>
                                        <i className="fas fa-angle-double-down"> </i>
                                    </button>
                                </div>

                                <div className="section second">

                                    <div className="rocket">
                                        <i className="fas fa-space-shuttle"> </i>
                                    </div>
                                    <main>
                                        <h2>IT IS NOW ON:</h2>
                                        <div className="details">
                                            <div>
                                                <p>{generalInfo.current.latitude}</p>
                                                <p>latitude </p>
                                            </div>
                                            <div>
                                                <p>{generalInfo.current.longitude}</p>
                                                <p>longitude </p>
                                            </div>
                                        </div>
                                        <p className="time">(<Timestamp time={generalInfo.current.timestamp} format='full'/>)</p>
                                        <button onClick={this.getISS}> SHOW ME MORE DETAILS </button>
                                        <div className="more">
                                            <p>It's {this.state.all.overallDistance}km travelled by ISS since you're here!</p>
                                            <p>That's speed is <strong>{this.state.all.speed}km/s </strong> now, when average speed = 7,66km/s </p>
                                        </div>
                                    </main>


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
        fetch('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-now.json')
        // old: http://open-notify.org/Open-Notify-API/ISS-Location-Now/ but it's http (danger)
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
                    isOk: true
                });
            })
            .catch(()=>{this.setState({isError: true})})
    };
}

class App extends React.Component {
    render() {
        return (
            <Fullpage/>
        );
    }
}

export default App
