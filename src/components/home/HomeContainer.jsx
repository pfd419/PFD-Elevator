import React from 'react';
import PropTypes from 'prop-types';

import { useAppContext } from '../../context/AppContext';

import './home.scss';

export const HomeContainer = props => {
  const [, dispatch] = useAppContext();
  
  const clickHandler = path => {
    dispatch({ type: "setPath", currentPath: path });
    props.history.push(path);
  };
  return (
    <div data-testid="home" className="home">
      <h1 data-testid="home-banner">List of Apps!</h1>
      <ul>
          <li>
            <button data-testid="home-elevator-button" onClick={() => clickHandler('/elevator')}>Elevator App</button>
          </li>
      </ul>
    </div>
  );
};
HomeContainer.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object
};
export default HomeContainer;
