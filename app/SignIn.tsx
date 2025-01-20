import { useNavigation } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TextInput, StyleSheet, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SignIn = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [Password, setPassword] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      const storedLoginStatus = await SecureStore.getItemAsync('isLoggedIn');
      if (storedLoginStatus === 'true') {
        // If logged in, navigate to Companies page
        navigation.navigate("Companies");
      }
    };
    checkLoginStatus();
  }, []);

  const handleSignIn = async () => {
    if (username === "OmSai" && Password === '9762230555') {
      // Save login status securely
      await SecureStore.setItemAsync('isLoggedIn', 'true');
      await SecureStore.setItemAsync('username', username); // Optional: Store the username or any other info
      navigation.navigate("Companies");
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TextInput
          style={styles.input}
          value={username}
          placeholder="UserName"
          placeholderTextColor="gray"
          onChangeText={(text) => setUsername(text)} 
        />

        <TextInput
          style={styles.input}
          value={Password}
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry
          onChangeText={(text) => setPassword(text)} 
        />

        <Button
          onPress={handleSignIn}
          title="Sign In"
          color="rgb(190, 78, 190)"
          accessibilityLabel="Learn more about this purple button"
        />

        <Text style={styles.bottomText}>Yes, We CAN!</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 200,
      height: 200,
    },
    input: {
      width: '80%',
      height: 50,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 20,
      backgroundColor: '#d3d3d3', // Matches the gray background in your design
    },
    bottomText: {
      marginTop: 80,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });