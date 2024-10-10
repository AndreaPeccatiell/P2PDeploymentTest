import { useState } from "react";
import "../Styles/ShowProcessLogs.css"

const ShowProcessLogs = ({ processLogs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleLogDisplay = () => {
        let mobileLinks = document.getElementById('mobileLinks');
        if(isOpen) {            
            mobileLinks && mobileLinks.classList.remove("mobileLinks-open");
        } else {
            mobileLinks && mobileLinks.classList.add("mobileLinks-open");            
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className={`log-container ${isOpen ? 'open' : ''}`}>
            <div className="log-header" onClick={toggleLogDisplay}>
                <span>Logs</span>
                <button>{isOpen ? '▲' : '▼'}</button>
            </div>
            {isOpen && (
                <div className="log-content">
                    {processLogs.length > 0 ? processLogs.map((log, index) => (
                        (log.logs !== 'Manual Cron trigger completed' && log.logs !== 'Manual cron triggered started') ? 
                        <p key={index} className="log-entry">{log.timestamp} : {log.logs}</p>
                        : <></>                    
                    )) : <p className="log-entry">No Logs Found !!!</p>}
                </div>
            )}
        </div>
    )
}

export default ShowProcessLogs;