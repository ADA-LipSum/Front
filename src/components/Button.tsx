import React from "react";
export const Button = (props: {
  children: React.ReactNode;
  backgroundColor?: string;
  borderRadius?: string;
}) => {
  return (
    <button
      style={{
        backgroundColor: props.backgroundColor,
        borderRadius: props.borderRadius,
      }}
    >
      {props.children}
    </button>
  );
};
