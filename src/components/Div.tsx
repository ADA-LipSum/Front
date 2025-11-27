import type { FC } from 'react';

import type { DivProps } from '@/@types/index';

//prettier-ignore
export const Div:FC<DivProps> = ({
  width, height, src, style:_style, className:_className,
  left, right, top, bottom,
  minWidth, maxWidth, minHeight, maxHeight,
  ...props
}) => {
  const style = {
    ..._style, width, height, backgroundImage: src && `url(${src})`,
    left, right, top, bottom,
    minWidth, maxWidth, minHeight, maxHeight
  }
  const className = [src && "bg-white", _className].join(' ')
  return <div {...props} style={style} className={className} />
}
