import { useState } from "react";
// import Utils from "../Common/Utils";
import '../Styles/SideMenu.css';
// import apiService from "../Services/ApiService";
import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDown from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUp from "@mui/icons-material/ArrowDropUpOutlined";
import AuthProviderService from "../Services/AuthProviderService";

const SideMenu = ({ cookieFile, setDrapeSheer, showToast, setShowComparePopup, setShowCompareFile, handleCompareDownload,  setuserName, userName }) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [open, setOpen] = useState(false);
    const [anchorEl, setanchorEl] = useState(null);
    const navToggle = (event) => {
        console.log("nav toggle")
        toggleMenu ? setToggleMenu(false) : setToggleMenu(true)
    };
   
    const handleComparePopup = (index) => {
        console.log(index)
        if (cookieFile && cookieFile.length && index <= cookieFile.length) {
            console.log(cookieFile[index])
            // let fName = cookieFile[index]['name'].replace(/pdf/i, '');            
            let uniqueTimestampStr = cookieFile[index]['uniqueTimestampStr']
            setShowCompareFile({ filename: cookieFile[index]['name'], uniqueTimestampStr: uniqueTimestampStr, phases: cookieFile[index]['phases'] })
            setShowComparePopup(true)
        }
    };

    const handleCompareDownloadWrap = async (index) => {
        console.log(index)
        if (cookieFile && cookieFile.length && index <= cookieFile.length) {
            console.log(cookieFile[index])
            await handleCompareDownload(cookieFile[index]['name'], cookieFile[index]['uniqueTimestampStr'])
            // setDrapeSheer(true)
            // let fName = cookieFile[index]['name'].replace(/pdf/i, 'csv');
            // const env = Utils.getEnvVars();
            // let endpoint = env.API_URL;
            // let url = endpoint + "/download_report";        
            // console.log(url) 
            // let uniqueTimestampStr =  cookieFile[index]['uniqueTimestampStr']
            // const queryParams = {
            //     filename: fName
            //     , mode: 'downloadxl'
            //     ,uniqueTimestampStr:uniqueTimestampStr
            // };
            // const queryString = Object.keys(queryParams)
            //     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            //     .join('&');
            // if (queryString) url = `${url}?${queryString}`
            // await apiService.fetchDownloadDataXL(url, fName, function (data) {
            //     console.log("ajax complete ", data)
            //     setDrapeSheer(false)
            // }, function (error) {
            //     setDrapeSheer(false)
            //     showToast("Error download compare!!!", "danger", 5000);
            // });
        }
    };

    const handleClick = (event) => {
        setOpen(true)
        setanchorEl(event.currentTarget)
    }

    const handleClose = (event) => {
        setOpen(false)
        setanchorEl(null)
    }
    const handleLogout = async (event) => {
        const isUserLoggedIn = await AuthProviderService.isLoggedIn();
        console.log(isUserLoggedIn)
        if (isUserLoggedIn) {
            AuthProviderService.logout();
        }
    }
    return (
        <>
            <div>
                <Box className="menu-account"
                    sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
                >
                    <Tooltip title="My Account">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? "account-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                        >
                            <AccountCircleIcon
                                sx={{ width: "2rem", height: "2rem" }}
                                style={{
                                    color: "#FFFFFF",
                                }}
                            />
                            {open ? (
                                <ArrowDropUp
                                    style={{
                                        color: "#FFFFFF",
                                    }}
                                />
                            ) : (
                                <ArrowDropDown
                                    style={{
                                        color: "#FFFFFF",
                                    }}
                                />
                            )}
                        </IconButton>
                    </Tooltip>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <MenuItem>
                        <Avatar /> {sessionStorage.getItem("userName")}
                    </MenuItem>

                    <Divider />

                    <MenuItem style={{ display: "flex", justifyContent: "center" }}>
                        <Button className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </MenuItem>
                </Menu>
                {(cookieFile && cookieFile.length) ?
                    <>
                        <div className="nav-menu" id="navMenu" onClick={navToggle}>
                            <div className="navbar-menu-div">
                                <div className="one"></div>
                                <div className="two"></div>
                                <div className="three"></div>
                            </div>
                        </div>
                        <div className="mobileLinks mobilelinkBodyouter" id="mobileLinks" style={toggleMenu ? { display: "block" } : { display: "none" }} >
                            <div className="mobilelinkHeader">
                                <h1>Reports</h1>
                            </div>
                            <div className="mobilelinkBody" id="mobilelinkBody">
                                <ul className="report-display">
                                    {cookieFile.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <div className="report-inner-li">
                                                    <div className="report-label">
                                                        <p className="truncate-txt">{item.name} {!item.process_type && item.uniqueTimestampStr_new !== "0" && item.uniqueTimestampStr_new}</p>
                                                    </div>
                                                    {!item.process_type &&
                                                    <div class="reportDiv" onClick={() => handleComparePopup(index)}>
                                                        <p class="truncate-txt">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
                                                                <path d="M 32.21875 2.0625 L 31.4375 2.375 L 28.625 3.46875 L 27.84375 3.78125 L 28.03125 4.59375 L 28.625 7.59375 C 28.332031 7.886719 28.019531 8.230469 27.6875 8.59375 L 24.71875 7.9375 L 23.90625 7.75 L 23.59375 8.5 L 22.375 11.3125 L 22.0625 12.0625 L 22.75 12.53125 L 25.3125 14.25 C 25.28125 14.738281 25.285156 15.230469 25.3125 15.71875 L 22.6875 17.34375 L 21.96875 17.78125 L 22.28125 18.5625 L 23.375 21.375 L 23.6875 22.15625 L 24.5 21.96875 L 27.5 21.375 C 27.804688 21.738281 28.140625 22.066406 28.5 22.375 L 27.8125 25.375 L 27.625 26.1875 L 28.40625 26.53125 L 31.21875 27.71875 L 31.96875 28.03125 L 32.4375 27.34375 L 34.15625 24.78125 C 34.644531 24.8125 35.136719 24.808594 35.625 24.78125 L 37.25 27.4375 L 37.6875 28.125 L 38.46875 27.84375 L 42.0625 26.40625 L 41.875 25.59375 L 41.1875 22.3125 C 41.5625 21.996094 41.902344 21.65625 42.21875 21.28125 L 45.25 22.0625 L 46.09375 22.28125 L 46.40625 21.5 L 47.625 18.6875 L 47.96875 17.90625 L 47.21875 17.4375 L 44.59375 15.84375 C 44.625 15.355469 44.621094 14.863281 44.59375 14.375 L 47.21875 12.75 L 47.9375 12.3125 L 47.625 11.53125 L 46.53125 8.71875 L 46.21875 7.9375 L 45.375 8.125 L 42.3125 8.8125 C 42.007813 8.449219 41.671875 8.121094 41.3125 7.8125 L 41.96875 4.8125 L 42.15625 4 L 41.40625 3.6875 L 38.59375 2.46875 L 37.8125 2.15625 L 37.34375 2.875 L 35.75 5.40625 C 35.289063 5.359375 34.789063 5.402344 34.28125 5.4375 L 32.65625 2.78125 Z M 31.375 4.53125 L 32.84375 6.9375 L 33.21875 7.53125 L 33.90625 7.375 C 34.613281 7.21875 35.28125 7.304688 36.1875 7.40625 L 36.8125 7.46875 L 37.15625 6.9375 L 38.59375 4.65625 L 39.84375 5.1875 L 39.21875 7.875 L 39.0625 8.53125 L 39.625 8.90625 C 40.238281 9.34375 40.75 9.855469 41.1875 10.46875 L 41.5625 11.03125 L 42.21875 10.875 L 44.96875 10.25 L 45.46875 11.5 L 43.0625 12.9375 L 42.53125 13.28125 L 42.59375 13.90625 C 42.6875 14.742188 42.6875 15.445313 42.59375 16.28125 L 42.53125 16.90625 L 43.0625 17.25 L 45.4375 18.71875 L 44.9375 19.90625 L 42.15625 19.21875 L 41.46875 19.0625 L 41.09375 19.625 C 40.65625 20.238281 40.144531 20.75 39.53125 21.1875 L 39 21.5625 L 39.125 22.21875 L 39.75 25.1875 L 38.5 25.65625 L 37.0625 23.28125 L 36.71875 22.75 L 36.09375 22.8125 C 35.257813 22.90625 34.554688 22.90625 33.71875 22.8125 L 33.09375 22.75 L 32.78125 23.25 L 31.25 25.5625 L 29.96875 25 L 30.5625 22.3125 L 30.71875 21.6875 L 30.1875 21.28125 C 29.574219 20.84375 29.0625 20.332031 28.625 19.71875 L 28.25 19.1875 L 27.59375 19.3125 L 24.90625 19.875 L 24.4375 18.625 L 26.8125 17.15625 L 27.375 16.8125 L 27.28125 16.1875 C 27.1875 15.351563 27.1875 14.648438 27.28125 13.8125 L 27.375 13.21875 L 26.84375 12.875 L 24.53125 11.34375 L 25.0625 10.0625 L 27.78125 10.6875 L 28.375 10.8125 L 28.75 10.34375 C 29.320313 9.679688 29.90625 9.09375 30.40625 8.59375 L 30.78125 8.21875 L 30.6875 7.71875 L 30.125 5.03125 Z M 35 10 C 32.25 10 30 12.25 30 15 C 30 17.75 32.25 20 35 20 C 37.75 20 40 17.75 40 15 C 40 12.25 37.75 10 35 10 Z M 35 12 C 36.667969 12 38 13.332031 38 15 C 38 16.667969 36.667969 18 35 18 C 33.332031 18 32 16.667969 32 15 C 32 13.332031 33.332031 12 35 12 Z M 13.53125 20 L 13.40625 20.84375 L 12.90625 24.09375 C 12.363281 24.265625 11.839844 24.515625 11.34375 24.78125 L 7.90625 22.28125 L 4.40625 25.78125 L 4.875 26.46875 L 6.78125 29.21875 C 6.511719 29.753906 6.273438 30.289063 6.09375 30.8125 L 2.8125 31.40625 L 2 31.5625 L 2 36.4375 L 2.8125 36.59375 L 6.09375 37.1875 C 6.269531 37.734375 6.511719 38.246094 6.78125 38.75 L 4.8125 41.40625 L 4.28125 42.09375 L 7.78125 45.59375 L 8.46875 45.125 L 11.21875 43.21875 C 11.753906 43.488281 12.289063 43.726563 12.8125 43.90625 L 13.3125 47.15625 L 13.4375 48 L 18.34375 48 L 18.46875 47.1875 L 19.09375 43.90625 C 19.636719 43.734375 20.160156 43.484375 20.65625 43.21875 L 24.09375 45.71875 L 27.59375 42.21875 L 27.125 41.53125 L 25.125 38.75 C 25.386719 38.222656 25.636719 37.703125 25.8125 37.1875 L 29.1875 36.59375 L 30 36.4375 L 30 31.53125 L 25.78125 30.90625 C 25.609375 30.367188 25.390625 29.839844 25.125 29.34375 L 27.125 26.59375 L 27.59375 25.90625 L 27.03125 25.3125 L 24.71875 22.90625 L 24.125 22.28125 L 23.40625 22.78125 L 20.65625 24.78125 C 20.128906 24.519531 19.609375 24.269531 19.09375 24.09375 L 18.59375 20.84375 L 18.46875 20 Z M 15.25 22 L 16.75 22 L 17.3125 25.5625 L 17.875 25.75 C 18.773438 26.050781 19.613281 26.332031 20.28125 26.75 L 20.84375 27.09375 L 21.375 26.71875 L 23.875 24.90625 L 25 26.09375 L 23.1875 28.625 L 22.78125 29.15625 L 23.15625 29.71875 C 23.605469 30.4375 23.957031 31.269531 24.125 32.03125 L 24.28125 32.6875 L 24.9375 32.78125 L 28 33.25 L 28 34.78125 L 24.9375 35.3125 L 24.34375 35.40625 L 24.15625 35.96875 C 23.855469 36.867188 23.574219 37.707031 23.15625 38.375 L 22.78125 38.9375 L 23.1875 39.46875 L 25 42 L 23.875 43.09375 L 21.375 41.28125 L 20.84375 40.90625 L 20.28125 41.25 C 19.5625 41.699219 18.730469 42.050781 17.96875 42.21875 L 17.34375 42.375 L 17.21875 43.03125 L 16.6875 46 L 15.15625 46 L 14.59375 42.4375 L 14.03125 42.25 C 13.132813 41.949219 12.292969 41.667969 11.625 41.25 L 11.0625 40.90625 L 10.53125 41.28125 L 8 43 L 6.90625 41.90625 L 8.6875 39.5 L 9.125 38.9375 L 8.75 38.375 C 8.300781 37.65625 7.949219 36.855469 7.78125 36.09375 L 7.625 35.4375 L 6.96875 35.3125 L 4 34.78125 L 4 33.21875 L 6.96875 32.6875 L 7.5625 32.5625 L 7.75 32.03125 C 8.050781 31.132813 8.332031 30.292969 8.75 29.625 L 9.09375 29.0625 L 8.71875 28.53125 L 7 26 L 8.125 24.90625 L 10.625 26.71875 L 11.15625 27.09375 L 11.71875 26.75 C 12.4375 26.300781 13.269531 25.949219 14.03125 25.78125 L 14.6875 25.625 L 14.78125 24.96875 Z M 16 29 C 13.253906 29 11 31.253906 11 34 C 11 36.746094 13.253906 39 16 39 C 18.746094 39 21 36.746094 21 34 C 21 31.253906 18.746094 29 16 29 Z M 16 31 C 17.65625 31 19 32.34375 19 34 C 19 35.65625 17.65625 37 16 37 C 14.34375 37 13 35.65625 13 34 C 13 32.34375 14.34375 31 16 31 Z"></path>
                                                            </svg>
                                                            <span className="tooltiptextpreviewconcur">Config</span>
                                                        </p>
                                                    </div>}
                                                    <div class="reportDiv" onClick={() => handleCompareDownloadWrap(index)}>
                                                        <p class="truncate-txt">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" width="24" height="24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                            </svg>
                                                            <span className="tooltiptextdownloadcompare">Dowload Report</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>

                    </> : <></>}
            </div>
        </>
    )
}

export default SideMenu;