import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage';
import Timestamp from 'react-timestamp';
import CountUp from 'react-countup';
import generalInfo from '../js/GeneralInfo';


class Fullpage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isError: false,  // TODO: prepare solution when error appear
            all: generalInfo,
            isOk: false,
            isDetailsVisible: false,
            isLoading: false,
            buttonText: "SHOW ME MORE DETAILS"
        }
    }

    render(){
        let details;
        let loader;

        const previousDistance = this.state.all.overallDistance - this.state.all.lastDistance;
        const currentDistance = this.state.all.overallDistance;

        if (this.state.isDetailsVisible) {
            details = (
                <div className="details">
                    <p>It's <strong><CountUp start={previousDistance} end={currentDistance}/>km</strong> travelled by ISS since you're here!</p>
                    <p>Based on these location, the calculated speed of ISS is <strong>{this.state.all.speed}km/s </strong> now, when average speed = 7.66km/s </p>
                </div>
            )
        }

        if(this.state.isLoading){
            loader = (
                <div className="loader"> </div>
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
                                    <div className="buttonLoader">
                                        <button onClick={this.showDetails} disabled={!this.state.isOk}> {this.state.buttonText} </button>
                                        {loader}
                                    </div>
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

        this.setState({
            isLoading: true,
        });
        //TODO delete this and write async func
        //TODO loaders while getting data
        fetch('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-now.json')
            .then(result => {
                // console.log(result);
                if (result.ok){
                    return result.json()
                } else {
                    this.setState({
                        isError: true
                    })
                }
            })
            .then(issPositionJSON => {
                generalInfo.setNext(issPositionJSON.iss_position, issPositionJSON.timestamp);
                this.setState({
                    isOk: true,
                    isLoading: false
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
