import React from 'react';
import { Svg, Path, Rect } from 'react-native-svg';

interface WalletIconProps {
  size?: number;
  color?: string;
}

export const WalletIcon: React.FC<WalletIconProps> = ({ size = 20, color = '#212121' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M5 8.33331H8.33333" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <Path d="M17.3611 9.16669H15.1923C13.7054 9.16669 12.5 10.2859 12.5 11.6667C12.5 13.0474 13.7054 14.1667 15.1923 14.1667H17.3611C17.4306 14.1667 17.4653 14.1667 17.4946 14.1649C17.944 14.1375 18.3019 13.8052 18.3314 13.3879C18.3333 13.3606 18.3333 13.3284 18.3333 13.2639V10.0694C18.3333 10.005 18.3333 9.97277 18.3314 9.94552C18.3019 9.52819 17.944 9.19585 17.4946 9.16844C17.4653 9.16669 17.4306 9.16669 17.3611 9.16669Z" stroke={color} stroke-width="1.5"/>
      <Path d="M17.4707 9.16667C17.4059 7.60642 17.197 6.64979 16.5235 5.97631C15.5473 5 13.9758 5 10.8332 5H8.33317C5.19047 5 3.61913 5 2.64281 5.97631C1.6665 6.95262 1.6665 8.524 1.6665 11.6667C1.6665 14.8093 1.6665 16.3807 2.64281 17.357C3.61913 18.3333 5.19047 18.3333 8.33317 18.3333H10.8332C13.9758 18.3333 15.5473 18.3333 16.5235 17.357C17.197 16.6836 17.4059 15.7269 17.4707 14.1667" stroke={color} stroke-width="1.5"/>
      <Path d="M5 5L8.11291 2.93594C8.9895 2.35469 10.1772 2.35469 11.0538 2.93594L14.1667 5" stroke={color} stroke-width="1.5" stroke-linecap="round"/>
      <Path d="M14.9927 11.6667H15.0002" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </Svg>
  );
}; 