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

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-purple-100 text-purple-600 font-medium flex items-center justify-center`}
    >
      {initial}
    </div>
  );
}
