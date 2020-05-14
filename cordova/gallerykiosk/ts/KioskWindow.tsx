import * as React from "react";

interface Props {
    apiKey: string;
    serviceEndpoint: string;
    setKioskMode: (newMode: boolean)=>void;
};

export const KioskWindow = ({apiKey, serviceEndpoint, setKioskMode}: Props) => {
    return (
        <div>
            <h1>Im not really implemented</h1>
        </div>
    );
};
