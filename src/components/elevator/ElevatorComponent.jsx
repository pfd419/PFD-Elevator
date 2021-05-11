import React, { useEffect, useCallback, useRef, useState } from 'react';

import { CONSTANTS } from '../../helpers';
import { useElevatorContext } from '../../context/ElevatorContext';
import elevatorApi from '../../api/floors';
import ElevatorFloorComponent from './ElevatorFloorComponent';

const ElevatorComponent = () => {
  const [error, setError] = useState();
  const [elevatorRun, setElevatorRun] = useState();
  const currentContext = useRef();
  const [state, dispatch] = useElevatorContext();
  const { floors, toggleState } = state;
 
  const updateFloors = useCallback(async floorsJson => {
    await dispatch({ type: 'setFloors', floors: floorsJson });
  }, [dispatch]);
  
  const startElevator = useCallback(() => {
    setElevatorRun(setInterval(() => {
      const { floors, currentStory, direction } = currentContext.current;
      if (currentStory === 1 || (direction === 'up' && currentStory !== floors.length)) {
        dispatch({ type: 'setCurrentStory', currentStory: currentStory + 1 });
      } else {
        dispatch({ type: 'setCurrentStory', currentStory: currentStory - 1 });
      }
    }, CONSTANTS.floorTimeoutMS));
  }, [dispatch]);
  const stopElevator = useCallback(() => {
    clearInterval(elevatorRun);
    setElevatorRun();
  }, [elevatorRun]);

  // For access to current context in setInterval
  useEffect(() => {
    currentContext.current = state;
  }, [state]);
  // To start elevator when toggle changes on
  useEffect(() => {
    if (toggleState && !elevatorRun) {
      startElevator();
    }
  }, [startElevator, toggleState, elevatorRun]);
  // To stop elevator when toggle changes off 
  useEffect(() => {
    if (!toggleState) {
      stopElevator();
    }
  }, [stopElevator, toggleState]);
  // To get floors and start toggle
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        await elevatorApi.getFloors(updateFloors);
      } catch (err) {
        // Handle fetch errors.
        setError(err.message)
      }
    };
    fetchFloors();
  }, [dispatch, updateFloors]);

  return (
    <div data-testid="elevator" className="elevator">
        {error && <div data-testid="elevator-error" className="error">{error}</div>}
        {floors && floors.map(f => <ElevatorFloorComponent floor={f} key={f.story} />)}
    </div>
  );
};

export default ElevatorComponent;
