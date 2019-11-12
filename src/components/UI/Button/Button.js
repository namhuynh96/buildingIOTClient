import React from 'react';
import classes from './Button.module.css';

const Button = props => {
    const buttonStyles = [classes.Button, classes[props.buttonType]];
    return (
        <button
            className={buttonStyles.join(' ')}
            disabled={props.disabled}
            onClick={props.clicked}
            type={props.type} >{props.children}</button>
    );
}

export default Button;