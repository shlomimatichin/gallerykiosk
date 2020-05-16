import {cordovaapp} from './cordovaapp';

cordovaapp.initialize();

import * as apiclient from './apiclient/apiclient';
apiclient.settings.fetchWrapper = fetch;
import * as React from "react";
import * as ReactDOM from "react-dom";

import materialUITheme from './materialuitheme';
import {ThemeProvider} from '@material-ui/core/styles';
import {App} from './App';

ReactDOM.render(

<ThemeProvider theme={materialUITheme}>
    <App/>
</ThemeProvider>

,document.getElementById("root"));
