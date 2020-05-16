import * as React from "react";
import {KioskWindow} from './KioskWindow';
import {ConfigurationWindow} from './ConfigurationWindow';
import * as apiclient from './apiclient/apiclient';

const DEFAULT_SERVICE_ENDPOINT = "https://43fn5f4bw7.execute-api.eu-central-1.amazonaws.com/dev";

export const App = () => {
    const [kioskMode, setKioskModeState] = React.useState(window.localStorage.getItem("kioskMode") === "true");
    const [apiKey, setApiKeyState] = React.useState(window.localStorage.getItem("apiKey") ?? "");
    const [serviceEndpoint, setServiceEndpointState] = React.useState(window.localStorage.getItem("serviceEndpoint") ?? "");

    React.useEffect(()=>{
        apiclient.settings.apiKey = apiKey;
        apiclient.settings.serviceEndpoint = serviceEndpoint || DEFAULT_SERVICE_ENDPOINT;
    }, []);

    const setKioskMode = (newMode: boolean) => {
        window.localStorage.setItem("kioskMode", newMode ? "true" : "");
        setKioskModeState(newMode);
    };

    const setApiKey = (newKey: string) => {
        window.localStorage.setItem("apiKey", newKey);
        setApiKeyState(newKey);
        apiclient.settings.apiKey = newKey;
    };

    const setServiceEndpoint = (newEndpoint: string) => {
        window.localStorage.setItem("serviceEndpoint", newEndpoint);
        setServiceEndpointState(newEndpoint);
        apiclient.settings.serviceEndpoint = newEndpoint || DEFAULT_SERVICE_ENDPOINT;
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
