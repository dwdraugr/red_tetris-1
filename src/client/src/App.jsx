import React from 'react';
import Game from './component/game/game';
import styles from './App.module.scss';

const App = () => (
  <div className={styles.container}>
    <Game />
  </div>
);

export default App;
