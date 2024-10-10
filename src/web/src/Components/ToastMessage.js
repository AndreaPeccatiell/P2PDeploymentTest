import { useEffect, useState } from "react";
import "../Styles/ToastMenu.css"

const ToastMessage = ({ message, toastType, duration, hideDom, setHideDom }) => {
    const [toastTimer, setToastTimer] = useState(undefined);

    useEffect(() => {
        console.log("toast timer")
        if (toastTimer) {
            clearTimeout(toastTimer);
            setToastTimer(undefined);
        }
        setToastTimer(
            setTimeout(function () {
                setHideDom(true);
                setToastTimer(undefined);
            }, duration)
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[!hideDom,duration]);

    // const memoizedHideToast = useCallback(() => {
    //     setHideDom(true);
    //     setToastTimer(undefined);
    // }, [setHideDom]); // Only include setHideDom if necessary

    // useEffect(() => {
    //     // Clear any existing toast timer
    //     const timer = toastTimer;
    //     if (timer) {
    //         clearTimeout(timer);
    //         setToastTimer(undefined);
    //     }        

    //     // Set the new toast timer
    //     setToastTimer(setTimeout(memoizedHideToast, duration));

    //     // Cleanup function to clear the timer on unmount
    //     return () => {
    //         if (toastTimer) {
    //             clearTimeout(toastTimer);
    //             setToastTimer(undefined);
    //         }
    //     };
    // }, [duration, toastTimer, memoizedHideToast]); // Only include dependencies that affect the effect


    let icon = {
        success: 'Success',
        danger: 'Error',
        warning: 'Warning',
        info: 'Info',
    };
    if (!Object.keys(icon).includes(toastType)) toastType = "info";
    return (
            hideDom ? <></> :
            <div className={"toastmsg toast-" + toastType}>
                <div className="toast-content-wrapper">
                    <div className="toast-icon">
                        <span className="material-symbols-outlined">{icon[toastType]}</span>
                    </div>
                    <div className="toast-message">{message}</div>
                    <div className="toast-progress"></div>
                </div>
            </div>
    )
}

export default ToastMessage;