import { createContext, useContext } from 'react';

const ElevatorContext = createContext();

export const useElevatorContext = () => useContext(ElevatorContext);

export default ElevatorContext;

export const initialElevatorState = {
  floors: [],
  currentStory: null,
  destinationStory: null,
  direction: 'up',
  toggleState: false,
  calledStories: []
};

export const elevatorReducer = (state = initialElevatorState, action) => {
  switch (action.type) {
    case 'setFloors': {
      return { ...state, floors: action.floors, currentStory: 1, toggleState: true };
    }
    case 'setDestinationStory': {
      return { ...state, destinationStory: action.destinationStory };
    }
    case 'setCurrentStory': {
      const usableCurrentStory = Math.min(Math.max(action.currentStory, 1), state.floors.length);
      let direction = state.direction;
      if (usableCurrentStory === 1) {
        direction='up';
      } else if (usableCurrentStory === state.floors.length) {
        direction='down';
      }
      // TODO: Process desintationStory once specs finalized
      return {
        ...state, 
        currentStory: usableCurrentStory,
        direction,
        calledStories: state.calledStories.filter(f =>
          (f.story !== usableCurrentStory || f.direction !== state.direction)
          && (f.story !== 1 || usableCurrentStory !== 1)
          && (f.story !== state.floors.length || usableCurrentStory !== state.floors.length))
      };
    }
    case 'addCalledStory': {
      // TODO: Process desintationStory once specs finalized
      const alreadyCalled = state.calledStories.some(s => s.story === action.calledStory.story && s.direction === action.calledStory.direction);
      const calledStories = alreadyCalled ? state.calledStories : state.calledStories.concat(action.calledStory);
      return { ...state, calledStories };
    } 
    case 'setDirection': {
      return { ...state, direction: action.direction };
    }
    case 'setToggleState': {
      return { ...state, toggleState: !state.toggleState };
    }
    default:
      return state;
  }
};
