import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const Details = () => {
  const params = useLocalSearchParams();
  console.log({ params });
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#f2f" }}>Details [{params.id}]</Text>
    </View>
  );
};

export default Details;
