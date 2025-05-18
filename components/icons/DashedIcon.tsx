import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface DashedIconProps {
  size?: number;
  color?: string;
}

export const DashedIcon: React.FC<DashedIconProps> = ({ size = 32, color = '#919191' }) => {
  return (
    <Svg width={2} height={size} viewBox="0 0 2 32" fill="none">
      <Path
        d="M1 1V31"
        stroke={color}
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </Svg>
  );
};
