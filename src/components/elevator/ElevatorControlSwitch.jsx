import React from 'react';
import Switch from "react-switch";

import { useElevatorContext } from '../../context/ElevatorContext';

export const ElevatorControlSwitch = props => {
  const [state, dispatch] = useElevatorContext();
  const { toggleState } = state;

  const handleChange = () => {
    dispatch({ type: 'setToggleState' });
  }

  return (
    <div data-testid="elevator-switch" className="switch">
      <Switch data-testid="elevator-switch-control" onChange={handleChange} checked={toggleState} onColor="#000000" />
    </div>
  );
};

export default ElevatorControlSwitch;
