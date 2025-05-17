import { CardPayment } from "@/components/CardPayment";
import { Button, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        width: 1000,
        maxHeight: 800,
        marginHorizontal: "auto",
      }}
    >
      <CardPayment></CardPayment>
      {/* <Button  onPress={() => console.log("hola")}>Mi botón</Button> */}
      {/* <DeckCard
        name={"Fundamentos de TS"}
        description="Lorem Ipsum es simplemente el texto de relleno. Lorem Ipsum es simplemente el texto de relleno. Lorem Ipsum es simplemente el texto de relleno."
        onPress={() => console.log("hola")}
      />
      <DeckCard
        name={"Intro a React Native"}
        description="Lorem Ipsum es simplemente el texto de relleno"
        onPress={() => console.log("hola 2")}
      /> */}
    </View>
  );
}
