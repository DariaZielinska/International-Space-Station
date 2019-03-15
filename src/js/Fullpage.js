import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage';
import Timestamp from 'react-timestamp';
import CountUp from 'react-countup';
import dataContainer from './DataContainer';

class Fullpage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isError: false,
            isDetailsVisible: false,
            isLoading: false,
            all: dataContainer,
            buttonText: "SHOW ME MORE DETAILS"
        }
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
        //TODO maybe delete this and write async func?
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
                dataContainer.setNext(issPositionJSON.iss_position, issPositionJSON.timestamp);
                this.setState({
                    isLoading: false,
                });
            })
            .catch(()=>{
                this.setState({isError: true});
            })
    };

    render(){
        let loader;
        let details;
        let error;

        if (this.state.isDetailsVisible) {

            const previousDistance = this.state.all.overallDistance - this.state.all.lastDistance;
            const currentDistance = this.state.all.overallDistance;

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

        if(this.state.isError){
            error = (
                <div className="details">
                    <p>There is something wrong with Internet connection, data or app :( Please, check your network and try again. If the problem persists, contact me by: dari.zielinska@gmail.com</p>
                </div>
                )
        }

        return (<div className="background-sky">
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
                                    <div className="location">
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
                                        <button onClick={this.showDetails} disabled={this.state.isLoading}> {this.state.buttonText} </button>
                                        {loader}
                                    </div>
                                    {details}
                                    {error}
                                </main>
                            </div>

                        </ReactFullpage.Wrapper>
                    );
                }}
            />
        </div>)
    }
}

export default Fullpage
