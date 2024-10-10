import logo from '../img/EliLilly_Logo.png';
import SideMenu from './SideMenu';
import "../Styles/NavBarContainer.css"

const Header = ({ initLoad,notFound,accessDenied, files, cookieFile, setCookieFile, setDrapeSheer, showToast, setShowComparePopup, setShowCompareFile, handleCompareDownload, setuserName, userName }) => {
  return (
    // <div className="navbar-container">
    //   <div className="logo"><img src={logo} alt='lilly'/></div>
    //   {
    //     initLoad || (notFound || accessDenied) ? <></> : <SideMenu cookieFile={cookieFile} setDrapeSheer={setDrapeSheer} showToast={showToast} setShowComparePopup={setShowComparePopup} setShowCompareFile={setShowCompareFile} handleCompareDownload={handleCompareDownload}/>          
    //   }
    // </div>
    <div className="navbar-container-header">
      <header>
    <nav>
      <ul>
        <li><div className="logo"><img src={logo} alt='lilly'/></div></li>
        
      </ul>
      {
        initLoad || (notFound || accessDenied) ? <></> : <SideMenu cookieFile={cookieFile} setDrapeSheer={setDrapeSheer} showToast={showToast} setShowComparePopup={setShowComparePopup} setShowCompareFile={setShowCompareFile} handleCompareDownload={handleCompareDownload} setuserName={setuserName} userName={userName}/>
      }
    </nav>
  </header>
    </div>
  )
}

export default Header;