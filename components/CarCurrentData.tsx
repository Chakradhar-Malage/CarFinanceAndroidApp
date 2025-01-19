import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { globalState, saveGlobalState } from '../src/globalState';
import axios from 'axios'; // Using axios for more detailed error handling

const CarCurrentData = () => {
    const [carData, setCarData] = useState([]);
    const [loading, setLoading] = useState(true); 
    
    const navigation = useNavigation();

    const fetchCarData = async () => {
        try {
            const response = await axios.get('http://192.168.1.203:3000/allentries');

            const { data, totalPendingAmount, totalCount } = response.data;
            setCarData(data);
            globalState.totalPendingAmount = totalPendingAmount;
            globalState.totalCount = totalCount;

            //saving updated counts of pending amount and total count in global state
            saveGlobalState();

            // console.log('Total Count:', totalCount);
            // console.log('Total Pending Amount:', totalPendingAmount);
        } catch (error) {
            console.error('Error fetching car details:', error.message);
            alert('Failed to load car data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarData();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.carCardComponent}
            onPress={() => {
                globalState.TempforViewing = item.id;
                // console.log(globalState.TempforViewing);
                navigation.navigate('ViewCarDetails');
            }}
        >
            <Image
                source={require('../assets/images/CardetailsComponentImg.png')}
                style={styles.carImg}
            />
            <View style={{ marginLeft: 20, flex: 1 }}>
                <Text style={styles.carId}>{item.id}</Text>
                <Text style={styles.carName} numberOfLines={1} ellipsizeMode="tail">
                    {item.name_of_vehicle}
                </Text>
            </View>
            <Text style={styles.date}>{item.date}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="purple" />
            </View>
        );
    }

    return (
        <View>
            <FlatList
                data={carData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

export default CarCurrentData;

const styles = StyleSheet.create({
    listContainer: {
      padding: 10,
    },

    carCardComponent: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        width: '90%',
        marginBottom: 6,
        backgroundColor: 'rgb(218, 216, 218)',
        borderRadius: 8,
        shadowColor: 'rgb(216, 212, 212)',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    carImg: {
        width: 55,
        height: 55,
        borderRadius: 15,
        backgroundColor: "purple"
    },

    carId: {
        fontWeight: '600',
        fontSize: 18,
    },

    carName: {
        fontSize: 15,
        fontWeight: '500',
        marginTop: 5,
        fontStyle: 'italic',
    },

    date: {
        fontSize: 12,
        color: '#rgb(74, 77, 74)',
        alignSelf: 'flex-end',
    },
});
