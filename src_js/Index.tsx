import * as React from 'react';
import *  as ReactDOM from "react-dom";
import { createStore, combineReducers,compose,applyMiddleware  } from "redux";
import { Provider,connect } from "react-redux";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import {
  HashRouter as Router,
  Route,
  Link,
  withRouter,
  Switch,
  Redirect
} from 'react-router-dom'
import * as objectAssign from 'object-assign';

import App from "./App";
import {IAppProps} from "./App";
import {AppReducer, AppActionDispatcher,IAppState} from "./AppReducer"
import IssueBrowser from './IssueBrowser';
import {IssueBrowserReducer, IssueBrowserActionDispatcher, IIssueBrowserState} from "./IssueBrowserReducer";
import {IIssueBrowserProps} from './IssueBrowser';
import {RouteComponentProps} from 'react-router-dom';

const rootReducer = combineReducers({ AppReducer,IssueBrowserReducer });
const store = createStore(rootReducer);

store.subscribe(() => console.log(store.getState()));




declare var __data: any;
function myAjax(url:string, onRecieved:(data:any)=>void):void {
    var s = document.createElement("script");
    s.src = url;
    s.onload = () => {
      onRecieved(__data);
    }

    var ele = document.getElementById("script");
    ele.appendChild(s);
}

function mapAppStateToProps(state : any):IAppProps {
  return objectAssign({}, state.AppReducer) as IAppProps;
}

function mapAppDispatchToProps(dispatch: any):any {
  return {
    actions:new AppActionDispatcher(dispatch, ()=>(store.getState() as any).AppReducer as IAppState)
  }
}

function mapIssueBrowserStateToProps(state : any, ownProps:RouteComponentProps<any>):IIssueBrowserProps {
  return objectAssign(
    {},
    state.IssueBrowserReducer, 
    {
      hostWidth:state.AppReducer.hostWidth, 
      hostHeight:state.AppReducer.hostHeight,
      selectedThermaId:state.AppReducer.selectedThermaId
    },
    ownProps);
}

function mapIssueBrowserDispatchToProps(dispatch: any) {
  return {
    actions:new IssueBrowserActionDispatcher(dispatch, ()=>(store.getState() as any).IssueBrowserReducer as IIssueBrowserState, myAjax)
  }
}

var AppContainer = connect(
  mapAppStateToProps,
  mapAppDispatchToProps)(App)
//var AppComponent = withRouter(AppContainer);

var IssueBrowserContainer = withRouter(connect(
  mapIssueBrowserStateToProps,
  mapIssueBrowserDispatchToProps)(IssueBrowser));


injectTapEventPlugin();

ReactDOM.render(
    <Provider store={store}>
      <Router>
        <AppContainer>
          <Switch>
            <Route path="/" component={IssueBrowserContainer}/>
          </Switch>
        </AppContainer>
      </Router>
    </Provider>
    ,document.getElementById("app")
);
