import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface FileIconProps {
  size?: number;
  color?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ size = 20, color = '#212121' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M6.66669 5.83331H13.3334"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.66669 9.16669H10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.8333 17.9167V17.5C10.8333 15.143 10.8333 13.9645 11.5656 13.2323C12.2978 12.5 13.4763 12.5 15.8333 12.5H16.25M16.6666 11.1193V8.33335C16.6666 5.19065 16.6666 3.61931 15.6903 2.643C14.7141 1.66669 13.1426 1.66669 9.99998 1.66669C6.85729 1.66669 5.28594 1.66669 4.30962 2.643C3.33331 3.6193 3.33331 5.19065 3.33331 8.33335V12.1202C3.33331 14.8244 3.33331 16.1764 4.0717 17.0923C4.22088 17.2773 4.3894 17.4458 4.57442 17.5949C5.49024 18.3334 6.84233 18.3334 9.54648 18.3334C10.1345 18.3334 10.4284 18.3334 10.6976 18.2384C10.7536 18.2186 10.8085 18.1959 10.8621 18.1703C11.1196 18.047 11.3275 17.8392 11.7432 17.4234L15.6903 13.4764C16.1721 12.9946 16.4129 12.7538 16.5398 12.4474C16.6666 12.1412 16.6666 11.8005 16.6666 11.1193Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 