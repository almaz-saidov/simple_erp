import React from 'react';
import '../styles/Nav.css'

function NavButton(props) {
  const { Icon, label, id, getCurrentCardId, setCurrentCardId } = props;

  const onClick = () => {
    setCurrentCardId(id);
    // console.log(id);
    // (id === getCurrentCardId() ? console.log("NavCurrentButtonIcon") : console.log("NavButtonIcon"));
  }

  return (
    <div className="NavButtonWrapper">
      <button className="NavButton" onClick={onClick}>
        <Icon className={id === getCurrentCardId() ? "NavCurrentButtonIcon" : "NavButtonIcon"} />
        <span>
          {label}
        </span>
      </button>
    </div>
  );
}

export default NavButton;
