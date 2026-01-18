import { TextInput, View, Text, TextInputProps } from "react-native";
import { clsx } from "clsx";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <View className="mb-4">
      {label && <Text className="mb-1.5 text-sm font-medium text-gray-700">{label}</Text>}
      <TextInput
        className={clsx(
          "rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-primary",
          error && "border-danger",
          className
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="mt-1 text-sm text-danger">{error}</Text>}
    </View>
  );
}

export default Input;

