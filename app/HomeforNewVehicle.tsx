import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Button, Alert, GestureResponderEvent} from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { globalState } from '@/src/globalState';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const Home = () => {

    const UserName = globalState.UserName;

    const [id, setId] = useState('');
    const [name_of_vehicle, setName_of_vehicle] = useState('');
    const [issued_to, setIssued_to] = useState('N/A');
    const [Agreed_amount, setAgreed_amount] = useState('0');
    const [Received_amount, setReceived_amount] = useState('0');
    const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'));
    const [driver_expense, setDriver_expense] = useState('');
    const [Fuel_expense, setFuel_expense] = useState('');
    const [Maintenance, setMaintenance] = useState('');

    const handleInputChange = (text) => {
        const formattedText = text.toUpperCase();
        setId(formattedText);
    }

    const saveData = async() => {
        if(!id.trim() || !name_of_vehicle.trim() || !issued_to.trim()){
            Alert.alert('Validation Error', 'ID, Name of Vehicle, and Issued To are required.');
            return;
        }

        const payload = {
            id,
            name_of_vehicle,
            issued_to,
            // Agreed_amount : parseInt(Agreed_amount, 10),
            Agreed_amount: Agreed_amount ? parseInt(Agreed_amount, 10) : 0,
            Received_amount: parseInt(Received_amount, 10),
            date,
            driver_expense: parseInt(driver_expense, 10),
            Fuel_expense: parseInt(Fuel_expense, 10),
            Maintenance: parseInt(Maintenance, 10),
        };

        try{
            const response = await fetch('http://15.207.48.53:3000/addVehicle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if(response.ok){
                Alert.alert('Success', result.message);
                setId('');
                setName_of_vehicle('');
                setIssued_to('N/A');
                setAgreed_amount('0');
                setReceived_amount('');
                setDate('');
                setDriver_expense('0');
                setFuel_expense('0');
                setMaintenance('0');
                
            }else{
                // const error = await response.json();
                console.error('Error:', error);
                Alert.alert('Error', error.error || 'Failed to save vehicle details.');
            }
        } catch{
            console.error('Network Error:', error.message);
            Alert.alert('Network Error', 'Unable to connect to the server.');
        } 
    } 

    return (
        <SafeAreaProvider>
            <KeyboardAwareScrollView
                style={{ flex: 1 }} // Ensure the scroll view takes full height
                keyboardShouldPersistTaps="handled"
            >
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
                    className='size-12'/>
                </TouchableOpacity>

                <View //code of line segment below username
                style={{
                margin:25,
                borderWidth:1,
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                }}
                />

                <View>
                    <Image source={require("../assets/images/Car.png")}
                    style={styles.carlogo}
                    />
                    <Text style={styles.headingOfHomePage}>
                        Enter Vehicle Details 
                    </Text>
                </View>

                <View>
                    <Text
                    style={styles.innertextbelowHeadings}
                    >Name of Vehicle :{'\n'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Vehicle"
                        placeholderTextColor="gray"
                        value={name_of_vehicle}
                        onChangeText={setName_of_vehicle}
                    />

                    <Text
                    style={styles.innertextbelowHeadings}
                    >Vehicle Number :{'\n'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Vehicle No."
                        placeholderTextColor="gray"
                        value={id}
                        onChangeText={setId}
                        autoCapitalize='characters'
                    />

                    <Text
                    style={styles.innertextbelowHeadings}
                    >Name of the person/Event vehicle issued to :{'\n'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Event/Person Name"
                        placeholderTextColor="gray"
                        value={issued_to}
                        onChangeText={setIssued_to}
                    />
                </View>

                <View>
                    <Image source={require('../assets/images/Bill.png')}
                    style={styles.billlogo}
                    />
                    <Text style={styles.headingOfHomePage}>
                        Billing Details 
                    </Text>

                    <Text style={styles.innertextbelowHeadings}>
                        Agreed Amount :{'\n'}
                    </Text>
                    <TextInput
                        style={styles.billinginput}
                        placeholder="Rs."
                        placeholderTextColor="gray"
                        value={Agreed_amount}
                        onChangeText={(text) => setAgreed_amount(parseInt(text, 10) || '')}
                    />

                    <Text style={styles.innertextbelowHeadings}>
                        Received Amount :{'\n'}
                    </Text>
                    <TextInput
                        style={styles.billinginput}
                        placeholder="Rs."
                        placeholderTextColor="gray"
                        value={Received_amount}
                        onChangeText={(text) => setReceived_amount(parseInt(text, 10) || '')}
                        keyboardType='numeric'
                    />

                    <Text style={{marginLeft: 250,marginTop: -160,fontSize: 15}}>
                        Date :{'\n'}
                    </Text>
                    <TextInput style={{width: '30%',height: 40,borderWidth: 1,borderColor: 'gray',borderRadius: 20,paddingHorizontal: 15,backgroundColor: '#d3d3d3', marginLeft:250}}
                        placeholder="dd/mm/yyyy"
                        placeholderTextColor="gray"
                        value={date}
                        onChangeText={setDate}
                    />
                </View>

                <View>
                    <Image source={require('../assets/images/Money.png')}
                    style={styles.moneylogo}
                    />
                    <Text style={styles.headingOfHomePage}> 
                        Other Expenses {'\n'}
                    </Text>
                    <Text style={styles.otherexpensetext}>
                        Driver Expense :
                    </Text>

                    <Text style={styles.otherexpensetext}>
                        Fuel Expense :
                    </Text>
                    <Text style={styles.otherexpensetext}>
                        Maintenance :
                    </Text>
                </View>

                <View>
                    <TextInput 
                    style={{width: '40%',height: 30,borderWidth: 1,borderColor: 'gray',borderRadius: 10,
                        paddingHorizontal: 15,backgroundColor: '#d3d3d3', marginLeft:170, marginTop: -90,
                        fontSize:13, paddingBottom:6}}
                    placeholder="Rs."
                    placeholderTextColor="gray"
                    value={driver_expense}
                    onChangeText={(text) => setDriver_expense(parseInt(text, 10) || '')}
                    keyboardType='numeric'
                    />

                    <TextInput 
                    style={{width: '40%',height: 30,borderWidth: 1,borderColor: 'gray',borderRadius: 10,
                        paddingHorizontal: 15,backgroundColor: '#d3d3d3', marginLeft:170, marginTop: 2,
                        fontSize:13, paddingBottom:5}}
                    placeholder="Rs."
                    placeholderTextColor="gray"
                    value={Fuel_expense}
                    onChangeText={(text) => setFuel_expense(parseInt(text, 10) || '')}
                    keyboardType='numeric'
                    />
                    <TextInput 
                    style={{width: '40%',height: 30,borderWidth: 1,borderColor: 'gray',borderRadius: 10,
                        paddingHorizontal: 15,backgroundColor: '#d3d3d3', marginLeft:170, marginTop: 2,
                        fontSize:13, paddingBottom:6}}
                    placeholder="Rs."
                    placeholderTextColor="gray"
                    value={Maintenance}
                    onChangeText={(text) => setMaintenance(parseInt(text, 10) || '')}
                    keyboardType='numeric'
                    />
                </View>
                <View style={styles.savebutton}>
                <Button
                    onPress={async () => {
                        if (!id || !name_of_vehicle) {
                            return Alert.alert('Error', 'ID, Name of Vehicle, and Issued To fields are required!');
                        }
                        saveData();
                        Alert.alert('Vehicle Details Saved!');
                        setId('');
                        setName_of_vehicle('');
                        setIssued_to('N/A');
                        setAgreed_amount('0');
                        setReceived_amount('0');
                        setDate(new Date().toLocaleDateString('en-GB'));
                        setDriver_expense('0');
                        setFuel_expense('0');
                        setMaintenance('0');
                        }
                    }
                    title="Save"
                    color="#841584"
                    accessibilityLabel="Save Vehicle Details"
                    />
                </View>
            </SafeAreaView>
            </KeyboardAwareScrollView>
        </SafeAreaProvider>
    )
}

export default Home;

const styles = StyleSheet.create({
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

    billlogo: {
        height:22,
        width: 18,
        marginTop: 20,
        marginLeft: 25,
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

    moneylogo: {
        height: 20,
        width: 21,
        marginTop: 112,
        marginLeft: 25,
    },

    otherexpensetext: {
        marginTop: 10,
        marginLeft: 40,
        fontSize: 15,
    },

    savebutton: {
        width:'40%',
        marginLeft: 115,
        marginTop: 20,
    }
})