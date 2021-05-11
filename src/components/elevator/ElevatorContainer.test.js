import React from 'react';
import { act, render, cleanup, fireEvent } from '@testing-library/react';

import ElevatorContext, { elevatorInitialState } from '../../context/ElevatorContext';
import ElevatorContainer from './ElevatorContainer';
import { CONSTANTS } from '../../helpers'; 

import mockFloors from '../../../mocks/mockFloors';

let elevatorContainerComp;
const elevatorContextReducer = [
  elevatorInitialState,
  jest.fn(),
];
const props = { };
const mockFloorsResponse = { floors: mockFloors };
const floorCount = mockFloors.length;

jest.setTimeout(30000);

describe('Elevator Container', () => {
  const originalError = console.error
  beforeAll(() => {
    // This is to silence an error we get for the moving car in a virtual dom
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Can\'t perform a React state update on an unmounted component')) {
        return;
      }
      return originalError.call(console, args);
    })
  })
  afterAll(() => {
    console.error.mockRestore();
  });
  describe('Error scenarios', () => {
    beforeEach(async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error("Error!");
      });
      await act(async () => {
        elevatorContainerComp = render(
          <ElevatorContext.Provider value={elevatorContextReducer}>
            <ElevatorContainer {...props} />
          </ElevatorContext.Provider>,
          elevatorContainerComp
        );
      });
    });
    afterEach(async () => {
      await act(async () => {
        jest.clearAllMocks();
        elevatorContainerComp = undefined;
        cleanup();
      });
    });
    describe('Elevator Block', () => {
      test('Should display error message', async () => {
        await expect(elevatorContainerComp.getByTestId('elevator')).toBeInTheDocument();
        await expect(elevatorContainerComp.getByTestId('elevator-error')).toBeInTheDocument();
        await expect(elevatorContainerComp.getByTestId('elevator-error')).toHaveTextContent("Error!");
      });
    });
  });
  describe('Normal Operation', () => {
    beforeEach(async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        return Promise.resolve({json: () => Promise.resolve(mockFloorsResponse)});
      });
      await act(async () => {
        elevatorContainerComp = render(
          <ElevatorContext.Provider value={elevatorContextReducer}>
            <ElevatorContainer {...props} />
          </ElevatorContext.Provider>,
          elevatorContainerComp
        );
      });
    });
    afterEach(async () => {
      await act(async () => {
        jest.clearAllMocks();
        elevatorContainerComp = undefined;
        cleanup();
      });
    });
    test('Should have basic elements as expected', async () => {
      await expect(elevatorContainerComp.getByTestId('elevator-container')).toBeInTheDocument();
      await expect(elevatorContainerComp.getByTestId('elevator')).toBeInTheDocument();
      await expect(elevatorContainerComp.getByTestId('elevator-stats')).toBeInTheDocument();
      await expect(elevatorContainerComp.getByTestId('elevator-switch')).toBeInTheDocument();
    });
    describe('Elevator Block', () => {
      test('Should have basic elements as expected', async () => {
        await expect(elevatorContainerComp.queryAllByTestId('elevator-story')).toHaveLength(floorCount);
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')).toHaveLength(floorCount);
        await expect(elevatorContainerComp.queryAllByTestId('elevator-floor')).toHaveLength(floorCount);
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls')).toHaveLength(floorCount);
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-up')).toHaveLength(floorCount);
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-up')[0]).toHaveClass('hidden');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-down')).toHaveLength(floorCount);
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-down')[2]).toHaveClass('hidden');
      });
      test('Should have moving car', async () => {
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[0]).not.toHaveClass('fa-user');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[1]).not.toHaveClass('fa-user');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[2]).toHaveClass('fa-user');
        await act(async () => {
          await new Promise((r) => setTimeout(r, CONSTANTS.floorTimeoutMS));
        });
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[0]).not.toHaveClass('fa-user');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[1]).toHaveClass('fa-user');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[2]).not.toHaveClass('fa-user');
      });
      test('Should toggle controls when clicked', async () => {
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-up')[1]).toHaveClass('fa-arrow-circle-o-up');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-down')[1]).toHaveClass('fa-arrow-circle-o-down');
        await act(async () => {
          await fireEvent.click(elevatorContainerComp.queryAllByTestId('elevator-controls-up')[1]);
          await fireEvent.click(elevatorContainerComp.queryAllByTestId('elevator-controls-down')[1]);
        });
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-up')[1]).toHaveClass('fa-arrow-circle-up');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-down')[1]).toHaveClass('fa-arrow-circle-down');
      });
      test('Should clear controls when car visits', async () => {
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-up')[1]).toHaveClass('fa-arrow-circle-o-up');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-down')[1]).toHaveClass('fa-arrow-circle-o-down');
        await act(async () => {
          await fireEvent.click(elevatorContainerComp.queryAllByTestId('elevator-controls-up')[1]);
          await fireEvent.click(elevatorContainerComp.queryAllByTestId('elevator-controls-down')[1]);
        });
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-up')[1]).toHaveClass('fa-arrow-circle-up');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-down')[1]).toHaveClass('fa-arrow-circle-down');
        // set delay to assure car passes 2nd floor
        await act(async () => {
          await new Promise((r) => setTimeout(r, CONSTANTS.floorTimeoutMS));
        });
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-up')[1]).toHaveClass('fa-arrow-circle-o-up');
        // set delay to assure car passes 2nd floor 2nd time
        await act(async () => {
          await new Promise((r) => setTimeout(r, 2 * CONSTANTS.floorTimeoutMS));
        });
        await expect(elevatorContainerComp.queryAllByTestId('elevator-controls-down')[1]).toHaveClass('fa-arrow-circle-o-down');
      });
      test('Should handle error', async () => {

      });
    });
    describe('Elevator Switch', () => {
      test('Should have basic element as expected', async () => {
        await expect(elevatorContainerComp.getByTestId('elevator-switch-control')).toBeInTheDocument();
      });
      test('Should shut down elevator car when toggled', async () => {
        await act(async () => {
          await fireEvent.click(elevatorContainerComp.getByTestId('elevator-switch-control'));
        });
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[0]).not.toHaveClass('fa-user');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[1]).not.toHaveClass('fa-user');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[2]).toHaveClass('fa-user');
        // set delay to assure car would move if not stopped
        await act(async () => {
          await new Promise((r) => setTimeout(r, CONSTANTS.floorTimeoutMS));
        });
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[0]).not.toHaveClass('fa-user');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[1]).not.toHaveClass('fa-user');
        await expect(elevatorContainerComp.queryAllByTestId('elevator-car')[2]).toHaveClass('fa-user');
      });
    });
    describe('Elevator Stats', () => {
      // TBD
    });
  });
});
