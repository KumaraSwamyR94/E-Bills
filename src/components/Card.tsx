import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";


interface CardProps extends ViewProps {
    className?: string;
}

const Card: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <View 
      className={twMerge("rounded-xl border border-gray-200 bg-white p-4 shadow-sm", className)} 
      {...props} 
    />
  );
}

export default Card;

