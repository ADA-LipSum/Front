import type { FC } from 'react';
import { Div } from './Div';

import type { AvatarProps } from '@/@types/index';

//prettier-ignore
export const Avatar:FC<AvatarProps> = ({
  className: _className, style, src, size, ...props
}) => {
  const w_or_h = size ?? '3rem'
  const className = ['rounded-full', _className].join(' ')
  return (
    <Div
      {...props}
      src={src}
      width={w_or_h}
      height={w_or_h}
      className={className}
      style={style}
    />
  )
}
