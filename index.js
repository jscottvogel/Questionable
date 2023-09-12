const express = require( 'express' );
const path = require( 'path' );
const uuid = require( 'uuid' );

const hostname = '127.0.0.1';
const port = 3000;

const server = express();
server.set( 'etag', false );
server.listen( port, hostname, () => {
    console.log( `Server running at http://${ hostname }:${ port }/` );
} );

server.use( express.static( path.resolve( __dirname, 'public' ) ) );
server.use( express.json() );
server.use( express.urlencoded() );

const controllerFactory = require( './controllers/ControllerFactory' );
const { request } = require( 'http' );
require( './controllers/EventControllers/EventController' );

//app.route( '/*' )
//    .get( function ( req, res ) {
//        res.sendFile( path.resolve( app.get( 'appPath' ) + '/index.html' ) );
//    } );

server.get( "/add_question.html", ( req, res ) => {
    res.sendFile( 'public/html/add_question.html', { root: __dirname } );
} );

server.get( "/view_eventdetail.html", ( req, res ) => {
    res.sendFile( 'public/html/view_eventdetail.html', { root: __dirname } );
} );

server.get( '/', function ( req, res ) {
    //res.sendFile( path.resolve( __dirname, 'pages/index.html' ) );
    res.sendFile( 'public/html/view_eventhistory.html', { root: __dirname } );
} );

server.get( '/events', function ( req, res ) {
    // this will return all events 
    // TODO - add code to return only events for the signed in user
    // TODO - add code to paginate the results
    Promise.all( [ controllerFactory.getEventController().findEvents() ] ).then( ( results ) => {
        //console.log( results[ 0 ].Items );
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( results[ 0 ].Items );
    } ).catch( ( error ) => {
        console.log( error );
        res.send( {} );
    } );
} );

server.patch( '/like', function ( req, res ) {
    // search for questions associated with the event
    // fetch the question
    Promise.all( [ controllerFactory.getEventController().likeQuestion( req.body.eId, req.body.qId ) ] ).then( ( results ) => {
        //console.log( results );

        // send 200 response
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( "Updated" );

    } ).catch( ( error ) => {
        console.log( error );
        res.status( 500 ).send( {} );
    } );
} );

server.patch( '/dislike', function ( req, res ) {
    // search for questions associated with the event
    // fetch the question

    Promise.all( [ controllerFactory.getEventController().dislikeQuestion( req.body.eId, req.body.qId ) ] ).then( ( results ) => {
        //console.log( results );
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( "Updated" );
    } ).catch( ( error ) => {
        console.log( error );
        res.status( 500 ).send( {} );
    } );
} );

server.get( '/event/:id', function ( req, res ) {
    // search for questions associated with the event
    // fetch the event
    //console.log( "Finding Event By Id: " + req.params.id );
    Promise.all( [ controllerFactory.getEventController().findEventById( req.params.id ) ] ).then( ( results ) => {
        //console.log( results );
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( results );
    } ).catch( ( error ) => {
        console.log( error );
        res.send( {} );
    } );
} );

server.post( '/event/:id/question', function ( req, res ) {
    // save or update the event
    //console.log( "Updating Event By Id: " + req.params.id )
    //console.log( req.body );
    Promise.all( [ controllerFactory.getEventController().addQuestion( req.params.id, req.body ) ] ).then( ( results ) => {
        //console.log( results );
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( results );
    } ).catch( ( error ) => {
        console.log( error );
        res.send( {} );
    } );
} );

server.put( '/event', function ( req, res ) {
    // save or update the event
    //console.log( "Updating Event By Id: " + req.params.id )
    //console.log( req.body );
    Promise.all( [ controllerFactory.getEventController().updateEvent( req.body ) ] ).then( ( results ) => {
        //console.log( results );
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( results );
    } ).catch( ( error ) => {
        console.log( error );
        res.send( {} );
    } );
} );

server.post( '/event', function ( req, res ) {
    // save or update the event
    //console.log( req.body );
    Promise.all( [ controllerFactory.getEventController().createEvent( req.body ) ] ).then( ( results ) => {
        //console.log( results );
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( results );
    } ).catch( ( error ) => {
        console.log( error );
        res.send( {} );
    } );
} );

/*
server.get( '/testcreate', function ( req, res ) {

    let event = {
        "id": uuid.v4(),
        "name": 'Event Two',
        "eventDate": new Date( '2023-09-01' ).toUTCString(),
        "questions": [ { "qid": uuid.v4(), "question": "What is up?", "ranking": 0 }, { "qid": uuid.v4(), "question": "What is you favorite color?", "ranking": 0 } ]
    };

    Promise.all( [ controllerFactory.getEventController().createEvent( event ) ] ).then( ( results ) => {
        //console.log( results );
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( results );
    } ).catch( ( error ) => {
        console.log( error );
        res.send( {} );
    } );

} );

server.get( '/testdelete/:id', function ( req, res ) {

    Promise.all( [ controllerFactory.getEventController().deleteEvent( req.params.id ) ] ).then( ( results ) => {
        //console.log( results );
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( results );
    } ).catch( ( error ) => {
        console.log( error );
        res.send( {} );
    } );

} );

server.get( '/testupdate/:id', function ( req, res ) {
    let event = {
        "id": req.params.id,
        "name": 'Updated Event',
        "eventDate": new Date().toUTCString(),
    };

    Promise.all( [ controllerFactory.getEventController().updateEvent( event ) ] ).then( ( results ) => {
        //console.log( results );
        res.set( 'Cache-Control', 'no-store' );
        res.status( 200 ).send( results );
    } ).catch( ( error ) => {
        console.log( error );
        res.send( {} );
    } );
} );
*/