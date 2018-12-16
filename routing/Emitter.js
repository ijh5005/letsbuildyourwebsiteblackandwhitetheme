function Emitter() {
    this.events = {}
}

Emitter.prototype.on = function(typeOfEvent, listener) {
    this.events[typeOfEvent] = this.events[typeOfEvent] || [];
    this.events[typeOfEvent].push(listener);
}

Emitter.prototype.emit = function(typeOfEvent, arrayOfParams) {
    if(this.events[typeOfEvent]){
        this.events[typeOfEvent].forEach((listener) => {
            (arrayOfParams) ? listener(...arrayOfParams) : listener();
        });
    }
}

module.exports = Emitter;