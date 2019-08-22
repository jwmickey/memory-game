import React from 'react'

function Card({ image = null, name = '???', flipped = false, matched = false }) {
  let classes = 'card horizontal';
  if (matched) {
    classes += ' matched';
  }

  let innerClasses = 'card-inner';
  if (flipped) {
    innerClasses += ' flipped';
  }

  let styles = {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  };

  if (image !== null) {
    let url = image;
    if (url.substring(0, 4) !== 'http') {
      url = require('../' + url);
    }
    styles.backgroundImage = 'url(' + url + ')';
  }

  return (
    <div className={classes}>
      <div className={innerClasses}>
        <div className="front">?</div>
        <div className="back" style={styles}>
          {!image && name}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Card);