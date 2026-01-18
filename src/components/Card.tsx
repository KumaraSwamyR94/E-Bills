import { Pressable, PressableProps } from "react-native";
import { twMerge } from "tailwind-merge";


interface CardProps extends PressableProps {
    className?: string;
}

const Card: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <Pressable 
      className={twMerge("rounded-xl border border-gray-200 bg-white p-4 shadow-sm", className)} 
      {...props} 
    />
  );
}

export default Card;

