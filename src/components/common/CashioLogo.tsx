import { BookIcon } from "./Icon";

interface CashioLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CashioLogo({ size = "md", className = "" }: CashioLogoProps) {
  const sizeConfig = {
    sm: {
      icon: "h-[24px]",
      text: "text-xl",
    },
    md: {
      icon: "h-[34px]",
      text: "text-3xl",
    },
    lg: {
      icon: "h-[44px]",
      text: "text-4xl",
    },
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <BookIcon className={`${sizeConfig[size].icon} text-purple-500`} />
      <span
        className={`${sizeConfig[size].text} font-semibold text-black font-titillium dark:text-white `}
      >
        Cashio
      </span>
    </div>
  );
}
