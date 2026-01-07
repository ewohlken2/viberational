// Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({ children, onClick, style, disabled, type }: ButtonProps) => {
  return (
    <button className="button" onClick={onClick} style={style} disabled={disabled} type={type}>
      {children}
    </button>
  );
};

export default Button;
