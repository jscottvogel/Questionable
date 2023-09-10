"use strict";

const EventController = require( './EventControllers/EventController' )

module.exports = class ControllerFactory {
    static eventController = null;

    static getEventController() {
        if ( ControllerFactory.eventController == null ) {
            ControllerFactory.eventController = new EventController();
        }

        return ControllerFactory.eventController;
    }
}