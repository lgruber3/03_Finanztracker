import React from "react";
import { View } from "react-native";
import BudgetSetupScreen from "./Budget";
import CashAccountSetup from "@/app/SetCash";
import NotificationPage from "@/app/NotificationPage";
import ChooseMode from "@/app/ChooseMode";
import SetCash from "@/app/SetCash";

export default function RootLayout() {
  return (

      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ flex: 4, backgroundColor: "#00FF7F" }} />
        <View style={{ flex: 6, backgroundColor: "#222222" }} />
        <View
            style={{
              position: "absolute",
              top: 70,
              left: 20,
              right: 20,
              bottom: 70,
              backgroundColor: "#FFFFFF",
              borderRadius: 25,
              padding: 20,
            }}>
            <NotificationPage/>
        </View>
      </View>


  );
}