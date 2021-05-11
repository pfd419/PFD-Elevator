import { initialElevatorState, elevatorReducer } from './ElevatorContext';

const mockFloors = [
  { "id": "1", "name": "Lobby", "story": 1 },
  { "id": "2", "name": "Second", "story": 2 },
  { "id": "3", "name": "Third", "story": 3 },
];

describe(`Elevator context`, () => {
  test('setFloors - intial state', () => {
    expect(elevatorReducer(undefined, '')).toEqual(initialElevatorState);
    const action = {
      type: 'setFloors',
      floors: mockFloors,
    };
    const expected = {
      ...initialElevatorState,
      floors: mockFloors,
      currentStory: 1,
      toggleState: true,
    };
    expect(elevatorReducer(initialElevatorState, action)).toEqual(expected);
  });

  test('setDestinationStory', () => {
    const action = {
      type: 'setDestinationStory',
      destinationStory: 2,
    };
    const expected = {
      ...initialElevatorState,
      floors: mockFloors,
      destinationStory: 2
    };
    expect(elevatorReducer({...initialElevatorState, floors: mockFloors}, action)).toEqual(expected);
  });

  test('setCurrentStory', () => {
    // Basic set
    const action = {
      type: 'setCurrentStory',
      currentStory: 2,
    };
    const expected = {
      ...initialElevatorState,
      floors: mockFloors,
      destinationStory: null,
      currentStory: 2
    };
    expect(elevatorReducer({...initialElevatorState, floors: mockFloors}, action)).toEqual(expected);
    // Out of bottom range set
    const action2 = {
      type: 'setCurrentStory',
      currentStory: -1,
    };
    const expected2 = {
      ...initialElevatorState,
      floors: mockFloors,
      destinationStory: null,
      currentStory: 1
    };
    expect(elevatorReducer({...initialElevatorState, floors: mockFloors}, action2)).toEqual(expected2);
    // Out of top range set
    const action3 = {
      type: 'setCurrentStory',
      currentStory: 10,
    };
    const expected3 = {
      ...initialElevatorState,
      floors: mockFloors,
      direction: 'down',
      destinationStory: null,
      currentStory: 3
    };
    expect(elevatorReducer({...initialElevatorState, floors: mockFloors}, action3)).toEqual(expected3);
    // Hit top clear top called floor
    const action4 = {
      type: 'setCurrentStory',
      currentStory: 3,
    };
    const expected4 = {
      ...initialElevatorState,
      floors: mockFloors,
      destinationStory: null,
      direction: 'down',
      currentStory: 3,
      calledStories: [{ story: 1, direction: 'up'}],
    };
    expect(elevatorReducer(
      {
        ...initialElevatorState,
        floors: mockFloors,
        calledStories: [{ story: 1, direction: 'up'}, {story: 3, direction: 'down' }]
      },
      action4
    )).toEqual(expected4);
    // Hit bottom clear bottom called floor
    const action5 = {
      type: 'setCurrentStory',
      currentStory: 1,
    };
    const expected5 = {
      ...initialElevatorState,
      floors: mockFloors,
      destinationStory: null,
      currentStory: 1,
      direction: 'up',
      calledStories: [{ story: 3, direction: 'down'}],
    };
    expect(elevatorReducer(
      {
        ...initialElevatorState,
        floors: mockFloors,
        direction: 'down',
        calledStories: [{ story: 1, direction: 'up'}, {story: 3, direction: 'down' }]
      },
      action5
    )).toEqual(expected5);
  });

  test('addCalledStory', () => {
    const action = {
      type: 'addCalledStory',
      calledStory: { story: 2, direction: 'down' },
    };
    const expected = {
      ...initialElevatorState,
      floors: mockFloors,
      calledStories: [{ story: 2, direction: 'down' }],
    };
    expect(elevatorReducer({ ...initialElevatorState, floors: mockFloors }, action)).toEqual(expected);
    const action2 = {
      type: 'addCalledStory',
      calledStory: { story: 2, direction: 'down' },
    };
    const expected2 = {
      ...initialElevatorState,
      floors: mockFloors,
      calledStories: [{ story: 2, direction: 'down' }],
    };
    expect(elevatorReducer({
      ...initialElevatorState,
      floors: mockFloors,
      calledStories: [{ story: 2, direction: 'down' }]
    }, action2)).toEqual(expected2);
  });

  test('setDirection', () => {
    const action = {
      type: 'setDirection',
      direction: 'down'
    };
    const expected = {
      ...initialElevatorState,
      direction: 'down',
    };
    expect(elevatorReducer(initialElevatorState, action)).toEqual(expected);
  });

  test('setToggleState', () => {
    const action = {
      type: 'setToggleState',
    };
    const expected = {
      ...initialElevatorState,
      toggleState: !initialElevatorState.toggleState,
    };
    expect(elevatorReducer(initialElevatorState, action)).toEqual(expected);
  });
});
