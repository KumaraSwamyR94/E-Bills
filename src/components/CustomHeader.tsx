import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ArrowLeftIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface CustomHeaderProps {
    title?: string;
    leftIcon?: string | React.ReactNode;
    rightIcon?: string | React.ReactNode;
    onLeftIconPress?: () => void;
    onRightIconPress?: () => void;
    showBackButton?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({title, leftIcon, rightIcon, onLeftIconPress, onRightIconPress, showBackButton = true}) => {

    const router = useRouter();

    const handleLeftPress = () => {
        if(onLeftIconPress) {
            onLeftIconPress();
        } else {
            router.back();
        }
    }
  return (
    <View className="flex-row items-center px-4 my-4">
      {showBackButton && (
        <TouchableOpacity onPress={handleLeftPress} className="mr-3">
          {leftIcon || <ArrowLeftIcon size={24} color="#1F2937" />}
        </TouchableOpacity>
      )}
      
      {title && (
        <Text className="flex-1 text-xl font-bold text-gray-900" numberOfLines={1}>
          {title}
        </Text>
      )}

      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} className="ml-3">
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  )
}

export default CustomHeader