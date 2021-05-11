import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import ElevatorContext, { initialElevatorState, elevatorReducer } from '../../context/ElevatorContext';
import ElevatorComponent from './ElevatorComponent';
import ElevatorStatsComponent from './ElevatorStatsComponent';
import ElevatorControlSwitch from './ElevatorControlSwitch';

import './elevator.scss';

export const ElevatorContainer = props => {
  
  return (
    <>
      <div className="banner"><div className="sub-banner">Welcome to Ellevation Towers!</div></div>
      <ElevatorContext.Provider value={useReducer(elevatorReducer, initialElevatorState)}>
        <div data-testid="elevator-container" className="elevatorContainer">
          <ElevatorComponent />
          <div className="rightContainer">
            <ElevatorStatsComponent />
            <ElevatorControlSwitch />
          </div>
        </div>
      </ElevatorContext.Provider>
    </>
  );
};

ElevatorContainer.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object
};
export default ElevatorContainer;
