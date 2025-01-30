
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { globalState } from '@/src/globalState';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import Modal from 'react-native-modal';
import moment from 'moment';

const ExportData = () => {
    const [data, setData] = useState([]);  // List of cars for the selected month
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState('');
    const [selectedCarRecords, setSelectedCarRecords] = useState([]);  // Store records of the selected car
    const [totalAgreedAmount, setTotalAgreedAmount] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [profit, setProfit] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);  // To manage modal visibility
    const [carDetails, setCarDetails] = useState({});  // Store selected car details for the modal
    const UserName = globalState.UserName;

    const navigation = useNavigation();

    // Fetch the list of cars for the selected month
    const exportLastMonthData = async () => {
        if (!month) {
            Alert.alert('Please select a month');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://192.168.1.205:3000/export-month?month=${month}`);
            const result = await response.json();

            if (response.ok) {
                setData(result.results);  // All car entries for the month
                setTotalAgreedAmount(result.totalAgreedAmount);
                setTotalExpenses(result.totalExpenses);
                setProfit(result.profit);
            } else {
                Alert.alert('Error', result.message || 'An error occurred');
            }
        } catch (error) {
            console.error("Error fetching export data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle the selection of a car
    const handleCarSelection = (vehicle_number) => {
        const selectedCar = data.filter(item => item.vehicle_number === vehicle_number);
        setSelectedCarRecords(selectedCar);

        // Calculate the total agreed amount, total expenses, and profit for the selected car
        let carAgreedAmount = 0;
        let carExpenses = 0;
        selectedCar.forEach(item => {
            carAgreedAmount += parseFloat(item.agreed_amount);
            carExpenses += parseFloat(item.total_expenses);
        });
        const carProfit = carAgreedAmount - carExpenses;

        setCarDetails({
            vehicle_number: vehicle_number,
            totalAgreedAmount: carAgreedAmount,
            totalExpenses: carExpenses,
            profit: carProfit,
        });

        setModalVisible(true);  // Open the modal with selected car records
    };

    // Filter the list of cars to show unique vehicle numbers
    const uniqueCarList = Array.from(new Set(data.map(item => item.vehicle_number)))
        .map(vehicle_number => {
            return data.find(item => item.vehicle_number === vehicle_number);
        });

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <Image style={styles.usrimg} source={require("../assets/images/usericon.png")} />
                    <View style={styles.usernameContainer}>
                        <Text style={styles.helloname}>Hello,</Text>
                        <Text style={styles.username}>{UserName}</Text>
                    </View>
                    <TouchableOpacity>
                        <Image style={styles.logoutimg} source={require("../assets/images/Logout.png")} />
                    </TouchableOpacity>
                </View>
                    <View style={styles.separator}></View>
                
                <TouchableOpacity onPress={() => navigation.navigate('customer_ledger')} style={styles.buttonledger}>
                    <Text style={styles.buttonledgerText}>Pending Ledger</Text>
                </TouchableOpacity>
                
                <View style={styles.container}>
                    {loading && <Text style={styles.loadingText}>Loading...</Text>}

                    {/* Month Picker */}
                    <Text style={styles.exportTitle}>Export Last Month Data</Text>
                    <View style={styles.monthPickerContainer}>
                        <Picker
                            selectedValue={month}
                            onValueChange={(itemValue) => setMonth(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Month" value="" />
                            <Picker.Item label="January" value="01" />
                            <Picker.Item label="February" value="02" />
                            <Picker.Item label="March" value="03" />
                            <Picker.Item label="April" value="04" />
                            <Picker.Item label="May" value="05" />
                            <Picker.Item label="June" value="06" />
                            <Picker.Item label="July" value="07" />
                            <Picker.Item label="August" value="08" />
                            <Picker.Item label="September" value="09" />
                            <Picker.Item label="October" value="10" />
                            <Picker.Item label="November" value="11" />
                            <Picker.Item label="December" value="12" />
                        </Picker>
                        <TouchableOpacity onPress={exportLastMonthData} style={styles.button}>
                            <Text style={styles.buttonText}>Export</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Display Total Agreed Amount, Total Expenses, and Profit */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Net Amount: Rs.{totalAgreedAmount.toFixed(2)}</Text>
                        <Text style={styles.totalText}>Total Expenses: Rs.{totalExpenses.toFixed(2)}</Text>
                        <Text style={styles.totalText}>Profit: Rs.{profit.toFixed(2)}</Text>
                    </View>

                    {/* List of Unique Cars */}
                    {uniqueCarList.length > 0 && !loading && (
                        <FlatList
                            data={uniqueCarList}
                            keyExtractor={(item) => item.vehicle_number}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    onPress={() => handleCarSelection(item.vehicle_number)} 
                                    style={styles.carCard}
                                >
                                    <Text style={styles.carText}>Car: {item.vehicle_number}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}

                    {/* Modal to Show Car Records */}
                    <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Monthly Record for {carDetails.vehicle_number}</Text>

                            {/* Display the total agreed amount, total expenses, and profit for the selected car */}
                            <View style={styles.totalsContainer}>
                                <Text style={styles.totalsText}>Total Agreed Amount: Rs. {carDetails.totalAgreedAmount}</Text>
                                <Text style={styles.totalsText}>Total Expenses: Rs. {carDetails.totalExpenses}</Text>
                                <Text style={styles.totalsText}>Total Profit: Rs. {carDetails.profit}</Text>
                            </View>

                            {/* Display the detailed records for the selected car */}
                            <FlatList
                                data={selectedCarRecords}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.carRecord}>
                                        <Text style={styles.detailsText}>ID: {item.id}</Text>
                                        <Text style={styles.detailsText}>Vehicle Number: {item.vehicle_number}</Text>
                                        <Text style={styles.detailsText}>Agreed Amount: Rs.{item.agreed_amount}</Text>
                                        <Text style={styles.detailsText}>Customer: {item.issued_to}</Text>
                                        <Text style={styles.detailsText}>Expenses: Rs.{item.total_expenses}</Text>
                                        <Text style={styles.detailsText}>Date: {moment(item.cleared_at).format('YYYY-MM-DD')}</Text>  {/* Formatted Date */}
                                        <Text style={styles.detailsText}>Profit: Rs.{(item.agreed_amount - item.total_expenses).toFixed(2)}</Text>
                                    </View>
                                )}
                            />
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};
export default ExportData;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        // backgroundColor: 'black'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 20,
    },
    usernameContainer: {
        // flex: 1,
        alignItems: 'flex-start',
        marginLeft: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    usrimg: {
        marginLeft: 3,
        marginTop: 20
    },
        username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'darkslategrey'
    },

    helloname: {
        marginTop: 15,
        marginLeft: 1,
        fontSize: 14,
    },
    logoutimg: {
        marginTop: 10,
        marginLeft: 200,
        width: 25,
        height: 25
    },
    separator: {
        margin: 0,
        marginLeft: 15,
        marginRight: 15,
        borderWidth: 1,
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
    },
    button: {
        backgroundColor: '#841584',
        paddingVertical: 12,
        borderRadius: 15,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginBottom: 1
    },
    buttonledger: {
        backgroundColor: '#841584',
        paddingVertical: 12,
        borderRadius: 15,
        width: 150,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginLeft: 15
    },
    buttonledgerText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    monthPickerContainer: {
        marginTop: -20,
        width: '90%',
        paddingTop:5,
        paddingLeft:1,
        paddingRight: 1,
        height: '11%',
        alignItems: 'center',
        borderRadius: 5,
        // backgroundColor: 'black',
        // paddingBottom: -104
        borderBlockColor: 'black',
        borderWidth: 2
    },
    exportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        marginTop: 0,
        marginBottom: 30
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 20,
    },
    carCard: {
        marginVertical: 5,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        width: 300,
        backgroundColor: '#fff',
    },
    carText: {
        fontSize: 16,
        color: '#333',
    },
    totalContainer: {
        marginTop: 55,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: '100%',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    picker: {
        height: 56,
        width: '95%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        // backgroundColor: '#fff',
        // backgroundColor: 'rgb(180, 142, 183)'
    },
    pickerItemStyle: {
        height: 50,
        fontSize: 15,
        color: 'black',
        fontWeight: 'condensedBold'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 15,
        paddingLeft: 2,
        paddingRight: 2,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        width: 325,
        marginTop: 30,
        marginBottom: 30
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    carRecord: {
        marginVertical: 5,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: 275,
        backgroundColor: '#fff',
    },
    detailsText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 5,
    },
});


