import { useEffect } from 'react';
import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";
import AccessDenied from './AccessDenied';
import AuthCallback from './AuthCallback';

const BodyWrap = ({ initLoad, notFound, accessDenied, isloading, setValidUser, setUserCheck, isValidUser, callback, setinitLoading, initloading, validPersona, setValidPersona, setpersonaAccess, personaAccess, setuserName, userName }) => {

    useEffect(() => {
        // Any necessary logic that affects authorization or loading can be placed here
    }, []);

    return (
        <div className='top-container'>
            {/* Only keeping necessary props for authorization in Header */}
            <Header initLoad={initLoad} notFound={notFound} accessDenied={accessDenied} isloading={isloading} setuserName={setuserName} userName={userName} />

            {accessDenied ? 
                <AccessDenied /> : 
                isloading ? 
                    <AuthCallback 
                        setValidUser={setValidUser} 
                        setUserCheck={setUserCheck}  
                        isValidUser={isValidUser} 
                        callback={callback} 
                        setinitLoading={setinitLoading} 
                        initloading={initloading}  
                        setValidPersona={setValidPersona} 
                        validPersona={validPersona}  
                        setpersonaAccess={setpersonaAccess} 
                        personaAccess={personaAccess} 
                        setuserName={setuserName} 
                        userName={userName} 
                    /> :
                    <Content 
                        initLoad={initLoad} 
                        notFound={notFound} 
                        setValidPersona={setValidPersona} 
                        validPersona={validPersona} 
                        setpersonaAccess={setpersonaAccess} 
                        personaAccess={personaAccess} 
                    />
            }

        </div>
    );
}

export default BodyWrap;
