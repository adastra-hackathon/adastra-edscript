import React, { memo } from 'react';
import Svg, { Path, Line } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export const EyeOffIcon = memo(function EyeOffIcon({ size = 20, color = '#8899B0' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94C16.23 19.24 14.17 20 12 20C5 20 1 12 1 12C2.24 9.68 3.95 7.65 6.06 6.06M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12C22.43 13.08 21.73 14.1 20.9 15.01M14.12 14.12A3 3 0 1 1 9.88 9.88"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1={1}
        y1={1}
        x2={23}
        y2={23}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
});
