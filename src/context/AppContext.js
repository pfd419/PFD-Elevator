import { createContext, useContext } from 'react';
import { HomeContainer, ElevatorContainer } from '../components';

const AppContext = createContext();
const defaultPath = "/elevator";

export const useAppContext = () => useContext(AppContext);

export default AppContext;

export const initialAppState = {
  pages: [ 
    { 
      path: '/home',
      exact: false,
      component: HomeContainer
    },
    { 
      path: '/elevator',
      exact: false,
      component: ElevatorContainer
    },
  ],
  currentPath: defaultPath
};

export const appReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case 'setPath': {
      return { ...state, currentPath: action.currentPath };
    }
    default:
      return state;
  }
};
