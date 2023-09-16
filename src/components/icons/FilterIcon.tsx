import * as React from "react";

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" {...props}>
      <g clipPath="url(#clip0_6_8837)">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
      </g>
      <defs>
        <clipPath id="clip0_6_8837">
          <path d="M0 0H24V24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default FilterIcon;
