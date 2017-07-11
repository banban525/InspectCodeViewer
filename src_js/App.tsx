import * as React from "react";
import { Component, StatelessComponent } from "react";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as objectAssign from 'object-assign';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import "jquery";
import {IAppState,AppActionDispatcher} from './AppReducer';
import {RouteComponentProps} from 'react-router-dom';


export interface IAppProps extends IAppState
{
  actions?:AppActionDispatcher;
  children?:JSX.Element;
}

class App extends Component<IAppProps> {
  resizeTimer: any= null;
  interval = Math.floor(1000 / 60 * 10);

  constructor(props: IAppProps) {
    super(props);

    console.log(props);
    
    window.addEventListener("resize", (): void => {
      if (this.resizeTimer !== null) {
        clearTimeout(this.resizeTimer as NodeJS.Timer);
      }
      this.resizeTimer = setTimeout(() => {
        this.props.actions.onResized();
      }, this.interval);
    });
  }


  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.props.selectedThermaId===0?lightBaseTheme:darkBaseTheme)}>
        <div>
        <link rel="stylesheet" href={this.props.selectedThermaId === 0?"css/bootstrap.min.css":"css/dark.bootstrap.min.css"} />
        <AppBar title="Inspect code viewer" style={{height:"64px"}} iconElementRight={
          <SelectField
            value={this.props.selectedThermaId}
            onChange={(event:any, index:number, value:number)=>this.props.actions.onChangedThema(value)}
            >
            <MenuItem key="thermaLight" value={0} primaryText="Light" />
            <MenuItem key="thermaDark" value={1} primaryText="Dark" />
            </SelectField>
        } />
        <Paper style={{height: (this.props.hostHeight - 24-64) + "px", overflow:"hidden"}}>
          {this.props.children}
        </Paper>
      </div>
    </MuiThemeProvider>
    );
  }
}

export default App;
