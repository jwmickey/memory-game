import React from 'react'

export default function Start({ sets, onChooseSet }) {
  return (
    <div className="start">
      <div className="sets">
        {sets.map((set, i) => {
          let styles = {};
          if (set.cover != null) {
            let url = set.cover;
            if (set.cover.substring(0, 4) !== 'http') {
              url = require('../' + set.cover);
            }
            styles.backgroundImage = 'url(' + url + ')';
          }

          return (
            <div key={set.name} style={styles} onClick={() => onChooseSet(i)} >
              <h2>{set.name}</h2>
              {set.credit && (
                <p className="credit">
                  Courtesy{' '}
                  <a onClick={e => e.stopPropagation()}
                     target="_blank" href={set.url}>{set.credit}</a></p>
              )}
            </div>
          );
        })}
      </div>
      <p>
        View project on <a href="https://github.com/jwmickey/memory-game">GitHub</a>.
      </p>
    </div>
  );
}
