import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Events = () => {
    const location = useLocation();
    const { eventType } = location.state || "Music";

    useEffect(() => {
        //console.log("LOCATION", location);
    }, []);

    return (
        <>
        HELLO
        
        </>
    );
}

export default Events;