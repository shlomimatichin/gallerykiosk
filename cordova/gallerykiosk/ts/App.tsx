import * as React from "react";
import {KioskWindow} from './KioskWindow';
import {ConfigurationWindow} from './ConfigurationWindow';

export const App = () => {
    const [kioskMode, setKioskModeState] = React.useState(window.localStorage.getItem("kioskMode") === "true");
    const [apiKey, setApiKeyState] = React.useState(window.localStorage.getItem("apiKey") ?? "");
    const [serviceEndpoint, setServiceEndpointState] = React.useState(window.localStorage.getItem("serviceEndpoint") || "https://43fn5f4bw7.execute-api.eu-central-1.amazonaws.com/dev");

    const setKioskMode = (newMode: boolean) => {
        window.localStorage.setItem("kioskMode", newMode ? "true" : "");
        setKioskModeState(newMode);
    };

    const setApiKey = (newKey: string) => {
        window.localStorage.setItem("apiKey", newKey);
        setApiKeyState(newKey);
    };

    const setServiceEndpoint = (newEndpoint: string) => {
        window.localStorage.setItem("serviceEndpoint", newEndpoint);
        setServiceEndpointState(newEndpoint);
    };

    if (kioskMode) {
        return <KioskWindow
                    setKioskMode={setKioskMode}
                    apiKey={apiKey}
                    serviceEndpoint={serviceEndpoint}
                />
    } else {
        return <ConfigurationWindow
                    setKioskMode={setKioskMode}
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                    serviceEndpoint={serviceEndpoint}
                    setServiceEndpoint={setServiceEndpoint}
                />
    }
};
