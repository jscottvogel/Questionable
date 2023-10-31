import { createContext, useState, useEffect } from "react"
import * as auth from "./auth"

const AuthContext = createContext()

function AuthProvider( { children } ) {
    const [ user, setUser ] = useState( null );
    const [ session, setSession ] = useState( null );
    const [ isLoading, setIsLoading ] = useState( true );

    const getCurrentUser = () => {
        setIsLoading( true );
        // wait for all the promises to resolve
        return Promise.all( [ auth.getCurrentUser(), auth.getSession() ] ).then( ( values ) => {
            //console.log( values );
            setUser( values[ 0 ] );
            //console.log( values[ 1 ] );
            setSession( values[ 1 ] );
            setIsLoading( false );
        } ).catch( ( err ) => {
            console.log( err );
            setUser( null );
            setSession( null );
            setIsLoading( false );
        } );
    }

    useEffect( () => {
        getCurrentUser();
    }, [] )

    const signIn = ( username, password ) => {
        setIsLoading( true );

        return auth.signIn( username, password ).then( ( user ) => {
            setUser( user );
            setIsLoading( false );
            getCurrentUser();
        } ).catch( ( err ) => {
            console.log( err );
            setUser( null );
            setIsLoading( false );
        } );
    }

    const signOut = () => {
        return auth.signOut().then( () => {
            setUser( null );
            setSession( null );
            setIsLoading( false );
        } ).catch( ( err ) => {
            //console.log( err );
            setUser( null );
            setSession( null );
            setIsLoading( false );
        } );
    }

    const isAdmin = () => {

        return auth.getSession().then(
            function ( sess ) {
                if ( sess.accessToken && sess.accessToken.payload && sess.accessToken.payload[ "cognito:groups" ] ) {
                    console.log( "Got Session" );
                    setSession( sess );
                    console.log( sess.accessToken.payload[ "cognito:groups" ] );
                    return sess.accessToken.payload[ "cognito:groups" ].includes( "Administrators" );
                } else {
                    console.log( "No session available" );
                    return false;
                }
            },
            function ( error ) {
                console.log( error );
                return false;
            }
        );
    }

    const authValue = {
        user,
        isLoading,
        session,
        signIn,
        signOut,
        getCurrentUser,
        isAdmin,
    }

    return (
        <AuthContext.Provider value={ authValue }>{ children }</AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }