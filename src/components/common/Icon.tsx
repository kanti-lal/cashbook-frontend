import { FC } from "react";

interface IconProps {
  className?: string;
}

export const BookIcon: FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={className}
    >
      <path
        fill="currentColor"
        d="M11 1H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7.5a.5.5 0 0 0 0-1H5a1 1 0 0 1-1-1v-.003h8.5a.5.5 0 0 0 .5-.5V3a2 2 0 0 0-2-2M5 3.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5"
      />
    </svg>
  );
};