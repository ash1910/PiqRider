import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface GPSIconProps {
  size?: number;
  color?: string;
}

export const GPSIcon: React.FC<GPSIconProps> = ({ size = 20, color = '#55B086' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M16.6668 10C16.6668 13.682 13.6821 16.6667 10.0002 16.6667C6.31826 16.6667 3.3335 13.682 3.3335 10C3.3335 6.31814 6.31826 3.33337 10.0002 3.33337C13.6821 3.33337 16.6668 6.31814 16.6668 10Z" stroke={color} strokeWidth="1.5"/>
      <Path d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61925 12.5 7.5 11.3807 7.5 10C7.5 8.61925 8.61925 7.5 10 7.5C11.3807 7.5 12.5 8.61925 12.5 10Z" stroke={color} strokeWidth="1.5"/>
      <Path d="M1.6665 10H3.33317" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M16.6665 10H18.3332" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M10 3.33329V1.66663" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M10 18.3333V16.6666" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  );
};
