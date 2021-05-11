import React from 'react';
import PropTypes from 'prop-types';

import { useElevatorContext } from '../../context/ElevatorContext';

const ElevatorFloorComponent = ({ floor }) => {
  const [state, dispatch] = useElevatorContext();
  const { floors, currentStory, calledStories } = state;
  
  const setCalledStory = (story) => {
    dispatch({ type: 'addCalledStory', calledStory: story });
  };
  const goingUp = () => {
    setCalledStory({ story: floor.story, direction: 'up' });
  };
  const goingDown = () => {
    setCalledStory({ story: floor.story, direction: 'down' });
  };

  const getCarMovingClass = () => {
    let retVal = 'car';
    if (floor.story === currentStory) {
      retVal = 'car fa fa-user at';
    }
    return retVal;
  };

  const getControlClass = direction => {
    const isSelected = calledStories.some(item => item.story === floor.story && item.direction === direction);
    let retVal = `fa fa-arrow-circle${!isSelected?'-o':''}-${direction}`;
    if (direction === 'up' && floor.story === floors.length) {
      retVal += ' hidden';
    } else if (direction === 'down' && floor.story === 1) {
      retVal += ' hidden';
    }
    
    return retVal;
  };
  
  return (
    <div data-testid="elevator-story" className="story">
      <div data-testid="elevator-car" className={getCarMovingClass()}></div>
      <div data-testid="elevator-floor" className="floor">
        {floor.name}
        <div data-testid="elevator-controls" className="controls">
          <i data-testid="elevator-controls-up" className={getControlClass('up')} onClick={()=>goingUp()} />
          <i data-testid="elevator-controls-down" className={getControlClass('down')} onClick={()=>goingDown()} />
        </div>
      </div>
    </div>
  );
};

ElevatorFloorComponent.propTypes = {
  floor: PropTypes.object,
};
export default ElevatorFloorComponent;
