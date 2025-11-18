import type {
  DetailedHTMLProps,
  HTMLAttributes,
  ImgHTMLAttributes,
  PropsWithChildren,
} from 'react';
import type { WidthHeightProps, LeftRightTopBottom, MinMaxWidthHeight } from '../@types/index';

export type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export type DivProps = ReactDivProps &
  ImgHTMLAttributes<HTMLImageElement> &
  PropsWithChildren<WidthHeightProps> &
  LeftRightTopBottom &
  MinMaxWidthHeight & {
    src?: string;
  };
