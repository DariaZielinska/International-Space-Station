import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage';
import Timestamp from 'react-timestamp';
import CountUp from 'react-countup';

let generalInfo = {
    prev: {
        longitude: 0,
        latitude: 0,
        timestamp: 0,
    },
    current: {
        longitude: 0,
        latitude: 0,
        timestamp: 0,
    },
    distanceBetweenTwo: 0,
    overallDistance: 0,
    speed: 0,

    setNext: function(position, timestamp){

        if(this.current.timestamp === timestamp){
            return;
        }

        //here: changing current data to previous
        this.prev.longitude = this.current.longitude;
        this.prev.latitude = this.current.latitude;
        this.prev.timestamp = this.current.timestamp;

        //do actualisation of current data
        this.current.longitude = position.longitude;
        this.current.latitude = position.latitude;
        this.current.timestamp = timestamp;

        if(this.prev.timestamp !== 0 ){
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
        this.speed = (this.distanceBetweenTwo / (this.current.timestamp - this.prev.timestamp)).toFixed(2);
    },
};

class Fullpage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isError: false,  // TODO: prepare solution when error appear
            all: generalInfo,
            isOk: false,
            isDetailsVisible: false,
            buttonText: "SHOW ME MORE DETAILS"
        }
    }

    render(){
        let details = null;

        const previousDistance = this.state.all.overallDistance - this.state.all.distanceBetweenTwo;
        const currentDistance = this.state.all.overallDistance;

        if (this.state.isDetailsVisible === true) {
            details = (
                <div className="details">
                    <p>It's <strong><CountUp start={previousDistance} end={currentDistance}/>km</strong> travelled by ISS since you're here!</p>
                    <p>Based on these information, the calculated speed of ISS is <strong>{this.state.all.speed}km/s </strong> now, when average speed = 7,66km/s </p>
                </div>
            )
        }

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
                                    <div className="localisation">
                                        <div>
                                            <p>{this.state.all.current.latitude}</p>
                                            <p>latitude </p>
                                        </div>
                                        <div>
                                            <p>{this.state.all.current.longitude}</p>
                                            <p>longitude </p>
                                        </div>
                                    </div>
                                    <p className="time">(<Timestamp time={this.state.all.current.timestamp} format='full'/>)</p>
                                    <button onClick={this.showDetails} disabled={!this.state.isOk}> {this.state.buttonText} </button>
                                    {details}
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

    showDetails = () => {

        this.getISS();

        this.setState({
            buttonText: "REFRESH",
            isDetailsVisible: true,
        })
    };

    getISS = () => {
        //TODO delete this and write async func
        //TODO loaders while getting data
        fetch('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-now.json')
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
            .catch(()=>{
                this.setState({isError: true});
            })
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
