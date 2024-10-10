import './App.css';
import { useEffect, useState } from 'react';
import BodyWrap from './Components/BodyWrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLoginProvider from './Services/UserLoginProvider';

function App() {
  const [userCheck, setUserCheck] = useState(false)
  const [isValidUser, setValidUser] = useState(false)
  const [validPersona, setValidPersona] = useState(false)
  const [personaAccess, setpersonaAccess] = useState([])
  const [initloading, setinitLoading] = useState(true)
  const [userName, setuserName] = useState("")

  useEffect(() => {
    try {
      let  isLoggedIn = sessionStorage.getItem("isUserLogged");
      let idToken = sessionStorage.getItem("idToken");
      console.log(isLoggedIn,idToken)
      if(isLoggedIn) {        
        setValidUser(isLoggedIn)
        setUserCheck(isLoggedIn)
      }
    } catch (e) {
      console.log('error', e)
    }
  }, [])

  // return (
  //   userCheck ? (isValidUser ? <BodyWrap /> : <BodyWrap notFound={true} />) : <BodyWrap initLoad={true} />
  // );

  return (
    <Router>
        <UserLoginProvider>
      <Routes>
          <Route exact path='/'  element={
            !initloading && userCheck ? (isValidUser && validPersona ? <BodyWrap /> : !validPersona ? <BodyWrap accessDenied={true} /> : <BodyWrap notFound={true} />) : <BodyWrap initLoad={true} isloading={true}  setValidUser={setValidUser} setUserCheck={setUserCheck} isValidUser={isValidUser} setinitLoading={setinitLoading} initloading={initloading} setValidPersona={setValidPersona} validPersona={validPersona} setpersonaAccess={setpersonaAccess} personaAccess={personaAccess} setuserName={setuserName} userName={userName}/>
          } />
        <Route path="/auth/accessdenied" element={<BodyWrap accessDenied={true} />} />
        <Route path="/auth/callback" element={<BodyWrap isloading={true} setValidUser={setValidUser} setUserCheck={setUserCheck}  isValidUser={isValidUser} callback={true} setinitLoading={setinitLoading}   initloading={initloading} setValidPersona={setValidPersona} validPersona={validPersona} setpersonaAccess={setpersonaAccess} personaAccess={personaAccess} setuserName={setuserName} userName={userName} />} />
      <Route path="/auth/login" element={<BodyWrap  initLoad={true} />} />
      </Routes>
      </UserLoginProvider>
    </Router>
  )
}

export default App;
