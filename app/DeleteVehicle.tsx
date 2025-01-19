
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Button, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { globalState } from '@/src/globalState';

const DeleteVehicle = () => {
    const [id, setId] = useState('');
    const UserName = globalState.UserName;

    const handleDelete = async () => {
        if (!id) {
            Alert.alert('Error', 'Please enter a Vehicle ID');
            return;
        }

        try {
            const response = await fetch(`http://15.207.48.53:3000/deleteVehicle/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.text();

            if (response.ok) {
                Alert.alert('Success', result);
            } else {
                Alert.alert('Error', result);
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            Alert.alert('Error', 'Failed to delete the vehicle');
        }
    };

    return (
        <GestureHandlerRootView>
            <SafeAreaView className='bg-white h-full'>
                <Image
                    style={styles.usrimg}
                    source={require("../assets/images/usericon.png")}
                    className="size-12 rounded-full"
                />
                <View className='flex flex-col items-start ml-2 justify-center'>
                    <Text style={styles.helloname}>Hello,</Text>
                </View>
                <Text style={styles.username}>{UserName}</Text>

                <TouchableOpacity>
                    <Image
                        style={styles.logoutimg}
                        source={require("../assets/images/Logout.png")}
                        className='size-12'
                    />
                </TouchableOpacity>

                <View
                    style={{
                        margin: 25,
                        borderWidth: 1,
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />

                <Text style={{ fontSize: 16, marginLeft: 20 }}>Enter the Vehicle Number to delete: {'\n'}</Text>
                <TextInput
                    style={styles.input}
                    value={id}
                    placeholder="Vehicle Number"
                    placeholderTextColor="gray"
                    onChangeText={(id) => setId(id)}
                    autoCapitalize='characters'
                />

                <View style={styles.deletebutton}>
                    <Button
                        onPress={handleDelete}
                        title="Delete"
                        color="#841584"
                        accessibilityLabel="Delete the vehicle"
                    />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default DeleteVehicle;

const styles = StyleSheet.create({
    username: {
        marginTop: -30,
        marginLeft: 90,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'darkslategrey',
    },

    helloname: {
        marginTop: -50,
        marginLeft: 90,
        fontSize: 14,
    },

    usrimg: {
        marginLeft: 20,
        marginTop: 20,
    },

    logoutimg: {
        marginTop: -30,
        marginLeft: 330,
        width: 25,
        height: 25,
    },

    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        paddingHorizontal: 20,
        marginBottom: 7,
        marginLeft: 30,
        backgroundColor: '#d3d3d3', // Matches the gray background in your design
    },

    deletebutton: {
        width: '40%',
        marginLeft: 115,
        marginTop: 20,
    },
});
