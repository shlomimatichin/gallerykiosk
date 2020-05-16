import * as React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from "@material-ui/core";
const Logo = require('@svgr/webpack!../assets/ic_launcher.svg').default;

interface Props {
    apiKey: string;
    setApiKey: (newKey: string) => void;
    serviceEndpoint: string;
    setServiceEndpoint: (newEndpoint: string) => void;
    setKioskMode: (newMode: boolean) => void;
};

export const ConfigurationWindow = ({apiKey, setApiKey, serviceEndpoint, setServiceEndpoint, setKioskMode}: Props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.logoContainer}>
                <Logo />
            </div>
            <div>
                <TextField
                    label="API Key"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                />
            </div>
            <div>
                <TextField
                    label="Service Endpoint"
                    value={serviceEndpoint}
                    onChange={e => setServiceEndpoint(e.target.value)}
                />
            </div>
            <div className={classes.buttonContainer}>
                <Button onClick={()=>setKioskMode(true)} variant="contained" color="primary">
                    Start Kiosk
                </Button>
            </div>
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
        logoContainer: {
            "& svg": {
                width: "100px",
            }
        },
        buttonContainer: {
            paddingTop: "20px",
        },
    }),
);
