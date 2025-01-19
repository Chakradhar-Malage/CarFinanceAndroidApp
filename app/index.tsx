// import { Link } from "expo-router";
// import React from "react";
// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//       <Link style={{fontSize:20}} href="./GenerateInvoice">Invoice</Link>
//       <Link style={{fontSize:20}} href="./Companies">Companies</Link>
//       <Link style={{fontSize:20}} href="./exportData">Export Data</Link>
//       <Link style={{fontSize:20}} href="./ViewInvoices">ViewInvoices</Link>
//       <Link style={{fontSize:20}} href="./SignIn">Sign IN</Link>
//   </View>
//   );
// }



//splash screen code, remove comments and implement it after sign in authentication implementation


import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to SignIn page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/SignIn');
    }, 3000);

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/images/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Flash Screen Text */}
      <Text style={styles.flashText}>Track And Monitor Your{'\n'}Expenses</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  flashText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'gray',
  },
});

  