import {cordovaapp} from './cordovaapp';

cordovaapp.initialize();

import * as React from "react";
import * as ReactDOM from "react-dom";

import materialUITheme from './materialuitheme';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {App} from './App';

ReactDOM.render(

<MuiThemeProvider theme={materialUITheme}>
    <App/>
</MuiThemeProvider>

,document.getElementById("root"));
