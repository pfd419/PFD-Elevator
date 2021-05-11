import React, { useEffect, useCallback, useRef, useState } from 'react';

import { useElevatorContext } from '../../context/ElevatorContext';
import elevatorApi from '../../api/floors';
import ElevatorFloorComponent from './ElevatorFloorComponent';

import { CONSTANTS } from '../../helpers';

const ElevatorComponent = () => {
  const [state, dispatch] = useElevatorContext();
  const { floors, toggleState } = state;
 
  const [error, setError] = useState();
  const [elevatorRun, setElevatorRun] = useState();
 
  const currentContextRef = useRef();
  
  const updateFloorsData = useCallback(async floorsJson => {
    await dispatch({ type: 'setFloorsData', floors: floorsJson });
  }, [dispatch]);
  
  const startElevator = useCallback(() => {
    setElevatorRun(setInterval(() => {
      const { floors, currentStory, direction } = currentContextRef.current;
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
    currentContextRef.current = state;
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
  // To get floors data and start toggle
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        await elevatorApi.getFloors(updateFloorsData);
      } catch (err) {
        // Handle fetch errors.
        setError(err.message)
      }
    };
    fetchFloors();
  }, [dispatch, updateFloorsData]);

  return (
    <div data-testid="elevator" className="elevator">
      {error && <div data-testid="elevator-error" className="error">{error}</div>}
      {floors && floors.map(f => <ElevatorFloorComponent floor={f} key={f.story} />)}
    </div>
  );
};

export default ElevatorComponent;
