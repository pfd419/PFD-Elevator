import { initialAppState, appReducer, useAppContext } from './AppContext';

describe(`App context`, () => {
  test('setPage - intial state', () => {
    expect(appReducer(undefined, '')).toEqual(initialAppState);
    const action = {
      type: 'setPath',
      currentPath: '/'
    };
    const expected = {
      ...initialAppState,
      currentPath: '/',
    };
    expect(appReducer(initialAppState, action)).toEqual(expected);
  });
});
