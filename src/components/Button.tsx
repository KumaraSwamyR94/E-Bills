import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  label: string;
  loading?: boolean;
}
const Button: React.FC<ButtonProps> = ({ 
  variant = "primary", 
  size = "md", 
  label, 
  loading, 
  className, 
  disabled,
  ...props 
}) => {
  
  const baseStyles = "rounded-lg flex-row items-center justify-center active:opacity-80";
  
  const variants = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    outline: "border border-gray-300 bg-transparent",
    ghost: "bg-transparent",
    destructive: "bg-danger",
  };

  const textVariants = {
    primary: "text-white font-semibold",
    secondary: "text-white font-semibold",
    outline: "text-gray-700 font-medium",
    ghost: "text-primary font-medium",
    destructive: "text-white font-semibold",
  };

  const sizes = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      className={twMerge(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        disabled && "opacity-50", 
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#000' : '#fff'} className="mr-2" />
      ) : null}
      <Text className={twMerge(textVariants[variant], textSizes[size])}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
