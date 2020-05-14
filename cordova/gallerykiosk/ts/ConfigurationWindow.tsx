import * as React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

interface Props {
    apiKey: string;
    setApiKey: (newKey: string)=>void;
    serviceEndpoint: string;
    setServiceEndpoint: (newEndpoint: string)=>void;
    setKioskMode: (newMode: boolean)=>void;
};

export const ConfigurationWindow = (props: Props) => {
    return (
        <div>
            <TextField
                label="API Key"
                value={props.apiKey}
                onChange={e=>props.setApiKey(e.target.value)}
            />
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }),
);
