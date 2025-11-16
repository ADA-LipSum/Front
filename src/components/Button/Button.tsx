import React from 'react';

export const Button = (props: {
  children: React.ReactNode;
  backgroundColor?: string;
  borderRadius?: string;
  color?: string;
}) => {
  return (
    <button
      style={{
        backgroundColor: props.backgroundColor,
        borderRadius: props.borderRadius,
        color: props.color,
      }}
    >
      {props.children}
    </button>
  );
};
