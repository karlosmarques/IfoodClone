
import { SacolaProvider } from "../context/SacolaContext";
import React, { useState } from "react";
import { Splash } from "@/components/Splash";
import { Stack } from "expo-router";


export default function RootLayout() {
   const [loading, setLoading] = useState(true);

   //animação
    if (loading) {
    return <Splash onFinish={() => setLoading(false)} />;
  }

  return (
    <SacolaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SacolaProvider>
  );
}


//   return (

    
//     <SacolaProvider>
//       <Slot />
//     </SacolaProvider>
//   );
// }


