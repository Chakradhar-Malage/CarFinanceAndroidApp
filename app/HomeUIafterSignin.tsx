
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CarCurrentData from '../components/CarCurrentData';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { globalState, loadGlobalState } from '@/src/globalState';

const HomeUIafterSignin = () => {
    const navigation = useNavigation();
    const UserName = globalState.UserName;

    const [totalPendingAmount, setTotalPendingAmount] = useState(globalState.totalPendingAmount);
    const [totalCount, setTotalCount] = useState(globalState.totalCount);

    useEffect(() => {
        const initializeGlobalState = async () => {
            await loadGlobalState();
            setTotalPendingAmount(globalState.totalPendingAmount);
            setTotalCount(globalState.totalCount);
        };

        initializeGlobalState();
    }, []);

    return (
        <GestureHandlerRootView>
            <SafeAreaView>
                {/* User Info Section */}
                <Image
                    style={styles.usrimg}
                    source={require('../assets/images/usericon.png')}
                    className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                    <Text style={styles.helloname}>Hello,</Text>
                </View>
                <Text style={styles.username}>{UserName}</Text>
                <TouchableOpacity>
                    <Image
                        style={styles.logoutimg}
                        source={require('../assets/images/Logout.png')}
                        className="size-12"
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

                {/* Buttons Section */}
                <TouchableOpacity onPress={() => navigation.navigate('HomeforNewVehicle')} style={styles.button}>
                    <Text style={styles.buttonText}>ADD NEW VEHICLE</Text>
                    <Image source={require('../assets/images/right-arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('exportData')} style={styles.button}>
                    <Text style={styles.buttonText}>EXPORT DATA</Text>
                    <Image source={require('../assets/images/right-arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('DeleteVehicle')} style={styles.button}>
                    <Text style={styles.buttonText}>DELETE VEHICLE</Text>
                    <Image source={require('../assets/images/right-arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>

                <View
                    style={{
                        margin: 25,
                        borderWidth: 1,
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
            </SafeAreaView>

            {/* Data Section */}
            <SafeAreaProvider style={{ marginBottom: 30 }}>
                <View>
                    <CarCurrentData />
                </View>
            </SafeAreaProvider>

            {/* Footer Section */}
            <SafeAreaView>
            <View>
                <Text style={{ marginLeft: 25, fontSize: 16 }}>Total Vehicles : {totalCount}</Text>
                <Text style={{ marginTop: 1, marginLeft: 25, fontSize: 16 }}>Pending Amount : Rs.{totalPendingAmount}</Text>
            </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default HomeUIafterSignin;

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
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#f5f5f5', // Optional, for better visual appearance
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttonText: {
        fontSize: 13,
        color: '#333',
        height:15,
        overflow: 'hidden',
        flexWrap: 'wrap',
        // numberOfLines: 1
    },
    arrowIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
});
