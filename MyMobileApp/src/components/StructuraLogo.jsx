import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * Reusable Structura vector architectural logo component.
 * Faithfully reproduces the geometric tower, ascending chevrons,
 * dynamic cantilevers, and circular arc motifs.
 *
 * @param {Object} props
 * @param {number} [props.size=180] - Width and height of the logo
 * @param {string} [props.navyColor='#222C50'] - Deep navy brand color
 * @param {string} [props.orangeColor='#F47B20'] - Construction orange brand color
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 */
export default function StructuraLogo({
  size = 180,
  navyColor = '#222C50',
  orangeColor = '#F47B20',
  style,
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 837 837"
      fill="none"
      style={style}
    >
      {/* 1. Top Orange Chevrons (Peak Spire) */}
      <Path
        d="M 404 52 L 333 123 L 333 233 L 404 162 Z"
        fill={orangeColor}
      />
      <Path
        d="M 433 52 L 504 123 L 504 233 L 433 162 Z"
        fill={orangeColor}
      />

      {/* 2. Middle Orange Architectural Pillars */}
      <Path
        d="M 404 192 L 333 263 L 333 482 L 404 411 Z"
        fill={orangeColor}
      />
      <Path
        d="M 433 192 L 504 263 L 504 482 L 433 411 Z"
        fill={orangeColor}
      />

      {/* 3. Flanking Navy Vertical Pillars */}
      <Path
        d="M 303 164 L 239 228 L 239 570 L 303 506 Z"
        fill={navyColor}
      />
      <Path
        d="M 534 164 L 598 228 L 598 570 L 534 506 Z"
        fill={navyColor}
      />

      {/* 4. Lower Navy Foundation, Cantilever Wings & Curved Shield Base */}
      <Path
        d="M 404 456 L 103 754 L 345 616 L 345 728 L 303 695 L 240 726 A 328.2 328.2 0 0 0 404 781 Z"
        fill={navyColor}
      />
      <Path
        d="M 433 456 L 734 754 L 492 616 L 492 728 L 534 695 L 597 726 A 328.2 328.2 0 0 1 433 781 Z"
        fill={navyColor}
      />

      {/* 5. Outer Flanking Construction Orange Arcs */}
      <Path
        d="M 208 318 A 287.5 287.5 0 0 0 167 647 L 191 623 A 255.4 255.4 0 0 1 208 365 Z"
        fill={orangeColor}
      />
      <Path
        d="M 629 318 A 287.5 287.5 0 0 1 670 647 L 646 623 A 255.4 255.4 0 0 0 629 365 Z"
        fill={orangeColor}
      />
    </Svg>
  );
}
