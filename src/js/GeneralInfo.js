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
    lastDistance: 0,
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
        this.lastDistance = distance;
        this.overallDistance =  this.overallDistance + Math.floor(distance);
    },

    calculateSpeed: function(){
        this.speed = (this.lastDistance / (this.current.timestamp - this.prev.timestamp)).toFixed(2);
    },
};

export default generalInfo