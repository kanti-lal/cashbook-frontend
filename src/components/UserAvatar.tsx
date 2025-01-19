interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({ name, size = "md" }: UserAvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  // dark:bg-purple-600 text-purple-600 dark:text-purple-100
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-purple-200 dark:bg-purple-600 text-purple-700 dark:text-purple-100 font-medium flex items-center justify-center`}
    >
      {initial}
    </div>
  );
}
