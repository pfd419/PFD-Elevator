import React from 'react';
import { act, render, cleanup, fireEvent } from '@testing-library/react';

import AppContext, { initialAppState } from '../../context/AppContext';
import HomeContainer from './HomeContainer';

let homeContainerComp;
const pushMock = jest.fn();
let props = {
  history: { push: pushMock },
  location: {},
  match: {},
}
const appContextReducer = [
  { ...initialAppState, currentPath: '\home' },
  jest.fn(),
];
describe('Home page container ', () => {
  beforeEach(async () => {
    await act(async () => {
      homeContainerComp = render(
        <AppContext.Provider value={appContextReducer}>
          <HomeContainer {...props} />
        </AppContext.Provider>,
        homeContainerComp
      );
    });
  });
  afterEach(async () => {
    await act(async () => {
      jest.clearAllMocks();
      homeContainerComp = undefined;
      cleanup();
    });
  });
  test('Should have elements and text as expected', async () => {
    await expect(homeContainerComp.getByTestId('home')).toBeInTheDocument();
    await expect(homeContainerComp.getByTestId('home-banner')).toBeInTheDocument();
    await expect(homeContainerComp.getByTestId('home-banner')).toHaveTextContent(
      'List of Apps'
    );
    await expect(homeContainerComp.getByTestId('home-elevator-button')).toBeInTheDocument();
    await expect(homeContainerComp.getByTestId('home-elevator-button')).toHaveTextContent(
      'Elevator App'
    );
  });
  test('Should click button to go to elevator app', async () => {
    await act(async () => {
      await fireEvent.click(homeContainerComp.getByTestId('home-elevator-button'));
    });
    await expect(pushMock).toHaveBeenCalledWith('/elevator');
  });
});
