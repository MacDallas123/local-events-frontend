import { createContext, useContext, useState } from "react";

const appMainContext = createContext();

export function useAppMainContext () {
    return useContext(appMainContext);
}

const AppProvider = ({ children }) => {
    const [ currentLayerName, setCurrentLayerName ] = useState("");
    const [ currentLayerAttribution, setCurrentLayerAttribution ] = useState("");

    const [ authUser, setAuthUser ] = useState(null);

    const [ dataSearch, setDataSearch ] = useState("");
    const [ dataOnMapSearch, setDataOnMapSearch ] = useState("");

    const [ reloadDatas, setReloadDatas ] = useState(false);
    const [ currentProjectionSystem, setCurrentProjectionSystem ] = useState(4326);

    const [ currentEditionPoint, setCurrentEditionPoint ] = useState([]);
    const [ selectedLayers, setSelectedLayers ] = useState([]);
    const [ statsSelectedLayers, setStatsSelectedLayers ] = useState([]);

    const value = {
        currentLayerName, setCurrentLayerName,
        currentLayerAttribution, setCurrentLayerAttribution,
        authUser, setAuthUser,
        dataSearch, setDataSearch,
        dataOnMapSearch, setDataOnMapSearch,
        currentEditionPoint, setCurrentEditionPoint,
        reloadDatas, setReloadDatas,
        currentProjectionSystem, setCurrentProjectionSystem,
        selectedLayers, setSelectedLayers,
        statsSelectedLayers, setStatsSelectedLayers
    };

  return <appMainContext.Provider value={value}>{children}</appMainContext.Provider>;
}

export default AppProvider;
