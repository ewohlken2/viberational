// Button.jsx
import React from 'react';

const Button = ({ children, onClick, style, disabled, type }) => {
    return (
        <button className="button" onClick={onClick} style={style} disabled={disabled} type={type}>
            {children}
        </button>
    );
};

export default Button;