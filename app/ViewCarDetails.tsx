import { View, Text, StyleSheet, Alert, SafeAreaView, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { globalState } from '@/src/globalState';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import the KeyboardAwareScrollView
import moment from 'moment';


const ViewCarDetails = () => {
    const [vehicleDetails, setVehicleDetails] = useState(null); // Store vehicle details
    const [loading, setLoading] = useState(true);
    const UserName = globalState.UserName;
    const navigation = useNavigation();
    const vehicleId = globalState.TempforViewing;
    const [received_amount, setReceivedAmount] = useState();
    const [agreed_amount, setAgreedAmount] = useState();
    const [issued_to, setIssuedTo] = useState();
    const [fuel_expense, setFuelExpense] = useState();
    const [maintenance, setMaintenance] = useState();
    const [driver_expense, setDriverExpense] = useState();
    const [date, setDate] = useState();

    useEffect(() => {
        const vehicleId = globalState.TempforViewing;
        
        if (!vehicleId) {
            Alert.alert('No vehicle ID found');
            setLoading(false);
            return;
        }
        
        const fetchVehicleDetails = async () => {
            try {
                const response = await fetch(`http://15.207.48.53:3000/searchById?id=${encodeURIComponent(vehicleId)}`);
                const data = await response.json();
                
                if (data.length === 0) {
                    Alert.alert('No details found for this vehicle');
                } else {
                    setVehicleDetails(data[0]); // Access the first object in the array
                    setAgreedAmount(data[0].agreed_amount); // Set initial agreed amount
                    setIssuedTo(data[0].issued_to); // Set initial issued_to value
                    setReceivedAmount(data[0].received_amount); // Set initial received amount
                    setDate(data[0].date); // Set the date field
                    setDriverExpense(data[0].driver_expense); // Set initial driver expense
                    setFuelExpense(data[0].fuel_expense); // Set initial fuel expense
                    setMaintenance(data[0].maintenance); // Set initial maintenance expense
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error fetching data', error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchVehicleDetails();
    }, []);

    const saveCarDetails = async () => {
        try {
            const updatedCarDetails = {};

            if (agreed_amount !== undefined) {
                updatedCarDetails.agreed_amount = parseInt(agreed_amount);
            }
            if (received_amount !== undefined) {
                updatedCarDetails.received_amount = parseInt(received_amount);
            }
            if (fuel_expense !== undefined) {
                updatedCarDetails.fuel_expense = parseInt(fuel_expense);
            }
            if (maintenance !== undefined) {
                updatedCarDetails.maintenance = parseInt(maintenance);
            }
            if (driver_expense !== undefined) {
                updatedCarDetails.driver_expense = parseInt(driver_expense);
            }
            if (issued_to !== undefined) {
                updatedCarDetails.issued_to = issued_to; // Update issued_to
            }
            if (date !== undefined) {
                updatedCarDetails.date = date; // Update the date if changed
            }
    
            const response = await axios.put(`http://15.207.48.53:3000/updateCarDetails/${vehicleId}`, updatedCarDetails);
    
            if (response.status === 200) {
                Alert.alert('Success', 'Car details updated successfully.');
                navigation.goBack(); // Navigate back to the previous screen
            } else {
                Alert.alert('Error', 'Failed to update car details.');
            }
        } catch (error) {
            console.error('Error updating car details:', error.response?.data || error.message);
            Alert.alert('Error', 'An error occurred while updating car details.');
        }
    };

    // const clearAndSaveDetails = async () => {
       
    //     try {
    //         // Calculate the total expenses
    //         const totalExpenses =
    //             (fuel_expense ? parseInt(fuel_expense) : 0) +
    //             (driver_expense ? parseInt(driver_expense) : 0) +
    //             (maintenance ? parseInt(maintenance) : 0);
    
    //         // Prepare the data to save
    //         const dataToSave = {
    //             vehicle_number: vehicleId,
    //             agreed_amount: parseInt(agreed_amount) || 0,
    //             issued_to: issued_to || 'N/A',
    //             total_expenses: totalExpenses,
    //             };
    
    //         // API call to save data to the database
    //         const response = await axios.post('http://15.207.48.53:3000/saveClearedDetails', dataToSave);
    
    //         if (response.status === 200) {
    //             Alert.alert('Success', 'Details saved successfully.');
    
    //             // Reset the fields
    //             setIssuedTo('N/A');
    //             setAgreedAmount(0);
    //             setReceivedAmount(0);
    //             setFuelExpense(0);
    //             setMaintenance(0);
    //             setDriverExpense(0);
    //         } else {
    //             Alert.alert('Error', 'Failed to save details.');
    //         }
    //     } catch (error) {
    //         console.error('Error saving cleared details:', error.response?.data || error.message);
    //         Alert.alert('Error', 'Vehicle is already cleared.');
    //     }
    // };
    
    const formattedDate = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");

    const clearAndSaveDetails = async () => {
        try {
            // Calculate the total expenses
            const totalExpenses =
                (fuel_expense ? parseInt(fuel_expense) : 0) +
                (driver_expense ? parseInt(driver_expense) : 0) +
                (maintenance ? parseInt(maintenance) : 0);
    
            // Prepare the data to save, including the date from the input
            const dataToSave = {
                vehicle_number: vehicleId,
                agreed_amount: parseInt(agreed_amount) || 0,
                issued_to: issued_to || 'N/A',
                total_expenses: totalExpenses,
                cleared_date: formattedDate,  // NEW: send the user-provided date
            };
    
            // API call to save data to the database
            const response = await axios.post('http://15.207.48.53:3000/saveClearedDetails', dataToSave);
    
            if (response.status === 200) {
                Alert.alert('Success', 'Details saved successfully.');
    
                // Reset the fields
                setIssuedTo('N/A');
                setAgreedAmount(0);
                setReceivedAmount(0);
                setFuelExpense(0);
                setMaintenance(0);
                setDriverExpense(0);
            } else {
                Alert.alert('Error', 'Failed to save details.');
            }
        } catch (error) {
            console.error('Error saving cleared details:', error.response?.data || error.message);
            Alert.alert('Error', 'Vehicle is already cleared.');
        }
    };
    

    if (loading) {
        return <Text>Loading...</Text>;
    }
    
    if (!vehicleDetails) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.error}>No details available for this vehicle.</Text>
            </SafeAreaView>
        );
    }

    const calculatePendingAmount = () => {
        const agreed = agreed_amount || vehicleDetails.agreed_amount;
        const received = received_amount || vehicleDetails.received_amount;
        return agreed - received;
    };

    const handleClearButtonPress = async () => {
        Alert.alert(
            'Clear Data',
            'Did customer has paid the full amount ?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: clearAndSaveDetails },
                { text: 'No', onPress: handlePendingAmount },
            ]
        );
    };


    const handlePendingAmount = async () => {
        const pendingAmount = calculatePendingAmount();
    
        if (pendingAmount > 0) {
            try {
                // Make the second API call with pending amount
                const response = await axios.post('http://15.207.48.53:3000/processPendingAmount', {
                    vehicleId: vehicleId,
                    pending_amount: pendingAmount,
                    customer_name: issued_to
                });
    
                if (response.status === 200 || response.status === 201) {
                    Alert.alert('Success', 'Pending amount processed successfully.');
                    await clearAndSaveDetails();
                    // Resetting state values
                    setIssuedTo('N/A');
                    setAgreedAmount(0);
                    setReceivedAmount(0);
                    setFuelExpense(0);
                    setMaintenance(0);
                    setDriverExpense(0);
                } else {
                    Alert.alert('Error', 'Failed to process pending amount: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error processing pending amount:', error.response?.data || error.message);
                Alert.alert('Error', 'An error occurred while processing pending amount: ' + (error.response?.data.message || error.message));
            }
        } else {
            Alert.alert('Error', 'Pending amount must be greater than zero.');
        }
    };

    return (
        <SafeAreaProvider>
            <KeyboardAwareScrollView
                style={{ flex: 1 }} // Ensure the scroll view takes full height
                keyboardShouldPersistTaps="handled"
            >
                <SafeAreaView>
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
    
                    <View>
                        <Image source={require("../assets/images/Car.png")} style={styles.carlogo} />
                        <Text style={styles.headingOfHomePage}>
                            Vehicle Details
                        </Text>
                    </View>
    
                    <View>
                        <Text style={styles.innertextbelowHeadings}>Name of Vehicle :{'\n'}</Text>
                        <TextInput
                            style={styles.input}
                            value={vehicleDetails.name_of_vehicle}
                            placeholder={vehicleDetails.name_of_vehicle}
                            placeholderTextColor="gray"
                            editable={false}
                            selectTextOnFocus={false}
                        />
    
                        <Text style={styles.innertextbelowHeadings}>Vehicle Number :{'\n'}</Text>
                        <TextInput
                            style={styles.input}
                            value={globalState.TempforViewing}
                            placeholder={globalState.TempforViewing}
                            placeholderTextColor="gray"
                            editable={false}
                            selectTextOnFocus={false}
                        />
    
                        <Text style={styles.innertextbelowHeadings}>Issued To :{'\n'}</Text>
                        <TextInput
                            style={styles.input}
                            value={issued_to}
                            placeholder="Event/Person Name"
                            placeholderTextColor="gray"
                            onChangeText={setIssuedTo}
                        />
    
                        <Text style={styles.innertextbelowHeadings}>Agreed Amount :{'\n'}</Text>
                        <TextInput
                            style={styles.billinginput}
                            value={agreed_amount.toString()}
                            placeholder={vehicleDetails.agreed_amount ? vehicleDetails.agreed_amount.toString() : ''}
                            placeholderTextColor="gray"
                            onChangeText={setAgreedAmount}
                            keyboardType='numeric'
                        />
    
                        <Text style={styles.innertextbelowHeadings}>Received Amount :{'\n'}</Text>
                        <TextInput
                            style={styles.billinginput}
                            value={received_amount?.toString()}
                            placeholder={vehicleDetails.received_amount ? vehicleDetails.received_amount.toString() : ''}
                            placeholderTextColor="black"
                            keyboardType='numeric'
                            onChangeText={setReceivedAmount}
                        />
    
                        <Text style={{ marginLeft: 250, marginTop: -160, fontSize: 15 }}>Date :{'\n'}</Text>
                        <TextInput
                            style={{
                                width: '30%',
                                height: 40,
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 20,
                                paddingHorizontal: 15,
                                backgroundColor: '#d3d3d3',
                                marginLeft: 250
                            }}
                            value={date}
                            placeholder={vehicleDetails.date}
                            placeholderTextColor="gray"
                            onChangeText={setDate}
                        />
                    </View>
    
                    <Text style={{ marginLeft: 40, marginTop: 105, fontSize: 15 }}>
                        Driver Expense :
                    </Text>
                    <Text style={styles.otherexpensetext}>
                        Fuel Expense :
                    </Text>
                    <Text style={styles.otherexpensetext}>
                        Maintenance :
                    </Text>
    
                    <View>
                        <TextInput
                            style={{
                                width: '40%',
                                height: 30,
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 10,
                                paddingHorizontal: 15,
                                backgroundColor: '#d3d3d3',
                                marginLeft: 180,
                                marginTop: -87,
                                fontSize: 13,
                                paddingBottom: 6
                            }}
                            value={driver_expense?.toString()}
                            onChangeText={setDriverExpense}
                            placeholder={vehicleDetails.driver_expense ? vehicleDetails.driver_expense.toString() : ''}
                            placeholderTextColor="gray"
                            keyboardType='numeric'
                        />
                        <TextInput
                            style={{
                                width: '40%',
                                height: 30,
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 10,
                                paddingHorizontal: 15,
                                backgroundColor: '#d3d3d3',
                                marginLeft: 180,
                                marginTop: 2,
                                fontSize: 13,
                                paddingBottom: 5
                            }}
                            value={fuel_expense?.toString()}
                            onChangeText={setFuelExpense}
                            placeholder={vehicleDetails.fuel_expense ? vehicleDetails.fuel_expense.toString() : ''}
                            placeholderTextColor="gray"
                            keyboardType='numeric'
                        />
                        <TextInput
                            style={{
                                width: '40%',
                                height: 30,
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 10,
                                paddingHorizontal: 15,
                                backgroundColor: '#d3d3d3',
                                marginLeft: 180,
                                marginTop: 2,
                                fontSize: 13,
                                paddingBottom: 6
                            }}
                            value={maintenance?.toString()}
                            onChangeText={setMaintenance}
                            placeholder={vehicleDetails.maintenance ? vehicleDetails.maintenance.toString() : ''}
                            placeholderTextColor="gray"
                            keyboardType='numeric'
                        />
                    </View>
    
                    <Text style={{ fontSize: 18, marginLeft: 20, marginTop: 20 }}> Pending Amount : Rs.{calculatePendingAmount()}</Text>
    
                    {/* Save Button */}
                    <View style={styles.savebutton}>
                        <Button
                            onPress={async () => {
                                Alert.alert('Do you want to save the details?');
                                saveCarDetails(); // Calls the function to save the updated details
                            }}
                            title="Save"
                            color="#841584"
                            accessibilityLabel="Save Car Details"
                        />
                    </View>
    

                    <View style={{ marginLeft: 215, marginTop: -45, width: '40%' }}>
                        <Button
                            onPress={handleClearButtonPress} // Updated to the new function
                            title="Clear"
                            color="#841584"
                            accessibilityLabel="Clear Car Details"
                        />
                    </View>

                </SafeAreaView>
            </KeyboardAwareScrollView>
        </SafeAreaProvider>
    );
    
};

export default ViewCarDetails

const styles = StyleSheet.create( {
    username: {
        marginTop: -30,
        marginLeft:90,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'darkslategrey'
    },

    helloname: {
        marginTop: -50,
        marginLeft:90,
        fontSize: 14,
    },

    usrimg: {
        marginLeft:20,
        marginTop: 20
    },

    logoutimg: {
        marginTop: -30,
        marginLeft:330,
        width:25,
        height:25
    },

    carlogo: {
        marginTop: 10,
        marginLeft: 20,
    },

    headingOfHomePage: {
        marginLeft: 60,
        marginTop: -28,
        fontSize: 20,
        fontWeight: '500',
    },

    innertextbelowHeadings: {
        marginLeft: 40,
        marginTop: 9,
        fontSize: 15,
    },

    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        paddingHorizontal: 20,
        marginBottom: 7,
        marginLeft: 40,
        backgroundColor: '#d3d3d3', // Matches the gray background in your design
    },

    container: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: 150,
        marginTop: 5,
        marginHorizontal: 5,
    },
    title: {
        fontSize: 16,
        color: "#000",
        marginLeft: 5,
        fontWeight: "600",
    },
    billinginput: {
        width: '40%',
        height: 35,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 6,
        marginBottom: 7,
        marginLeft: 40,
        backgroundColor: '#d3d3d3', 
    },
    otherexpensetext: {
        marginTop: 10,
        marginLeft: 40,
        fontSize: 15,
    },

    savebutton: {
        width:'40%',
        marginLeft: 30,
        marginTop: 40,
        marginBottom:10
    }
})


