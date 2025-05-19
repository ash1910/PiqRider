import * as React from 'react';
import Svg, { Rect, Mask, G, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CardIconProps {
  size?: number;
  color?: string;
}

export const CardIcon: React.FC<CardIconProps> = ({ size = 343, color = 'white' }) => {
  return (
    <Svg width={size} height={size * (205/343)} viewBox="0 0 343 205" fill="none">
      <Rect width={size} height={size * (204.96/343)} rx="16" fill={color} fillOpacity="0.2"/>
      <Mask id="mask0_148_435" maskType="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width={size} height={size * (205/343)}>
        <Rect width={size} height={size * (204.96/343)} rx="16" fill="#C6E3E5"/>
      </Mask>
      <G mask="url(#mask0_148_435)">
        <Ellipse 
          cx={size * (158.388/343)} 
          cy={size * (154.745/343)} 
          rx={size * (158.388/343)} 
          ry={size * (154.745/343)} 
          transform="matrix(-1 0 0 1 170.976 -64.5625)" 
          fill="url(#paint0_linear_148_435)" 
          fillOpacity="0.3"
        />
      </G>
      <Defs>
        <LinearGradient 
          id="paint0_linear_148_435" 
          x1={size * (188.807/343)} 
          y1={size * (98.3808/343)} 
          x2={size * (44.3375/343)} 
          y2={size * (296.359/343)} 
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={color}/>
          <Stop offset="1" stopColor={color} stopOpacity="0"/>
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
