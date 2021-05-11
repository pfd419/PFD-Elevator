import React, { useReducer } from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import AppContext, { initialAppState, appReducer, useAppContext } from './context/AppContext';

import './App.scss';

const AppContainer = () => {
  const [state, ] = useAppContext();
  const { pages, currentPath } = state;
  
  return (
    <HashRouter context={AppContext}>
      <div className="app">
        <div className="banner">
          Ellevation Education
        </div>
        <div>
          <Route exact path="/">
            <Redirect to={currentPath} />
          </Route>
          {pages.map(p => <Route path={p.path} exact={p.exact} component={p.component} key={p.path} />)}
        </div>
      </div>
    </HashRouter>
  );
};

export default function AppComponent() {
  return (
    <AppContext.Provider value={useReducer(appReducer, initialAppState)}>
      <AppContainer />
    </AppContext.Provider>
  )
}