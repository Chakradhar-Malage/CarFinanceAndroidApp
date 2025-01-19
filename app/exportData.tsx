import React, { useState } from 'react';
import { View, Text, FlatList, 
        StyleSheet, Alert, TextInput, 
        Image, TouchableOpacity,
        ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';  
import { globalState } from '@/src/globalState';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';

const ExportData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customername, setCustomername] = useState('');
    const [month, setMonth] = useState('');
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [totalAgreedAmount, setTotalAgreedAmount] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [profit, setProfit] = useState(0);
    const UserName = globalState.UserName;

    const navigation = useNavigation();

    // const fetchData = async () => {
    //     if (!customername.trim()) {
    //         Alert.alert('Please Enter Customer Name');
    //         return;
    //     }

    //     setLoading(true);
    //     setSearchInitiated(true);

    //     try {
    //         const response = await fetch(`http://192.168.1.203:3000/search?customername=${encodeURIComponent(customername.trim())}`);
    //         const result = await response.json();
    //         setData(result);
    //     } catch (error) {
    //         console.error("Error fetching data:", error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const exportLastMonthData = async () => {
        if (!month) {
            Alert.alert('Please select a month');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://192.168.1.203:3000/export-month?month=${month}`);
            const result = await response.json();

            if (response.ok) {
                setData(result.results);
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

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
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
                </View>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('customer_ledger')} 
                    style={styles.buttonledger}>
                    <Text style={styles.buttonledgerText}>Ledger</Text>
                </TouchableOpacity>
                <View style={styles.container}>

                    {loading && <Text style={styles.loadingText}>Loading...</Text>}

                    {searchInitiated && !loading && data.length === 0 && (
                        <Text style={styles.noDataText}>No data available.</Text>
                    )}

                    {/* Export Data by Month */}
                    <View style={styles.monthPickerContainer}>
                        <Text style={styles.exportTitle}>Export Last Month Data</Text>
                        <Picker
                            selectedValue={month}
                            onValueChange={(itemValue) => setMonth(itemValue)}
                            style={styles.picker}
                            dropdownIconColor='gray' 
                            itemStyle={styles.pickerItemStyle} 
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
                        <TouchableOpacity 
                            onPress={exportLastMonthData} 
                            style={styles.button}>
                            <Text style={styles.buttonText}>Export</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Display Total Agreed Amount, Total Expenses, and Profit */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Net Amount: Rs.{totalAgreedAmount.toFixed(2)}</Text>
                        <Text style={styles.totalText}>Total Expenses: Rs.{totalExpenses.toFixed(2)}</Text>
                        <Text style={styles.totalText}>Profit: Rs.{profit.toFixed(2)}</Text>
                    </View>

                    {/* Display Data Results Below the Export Button */}
                    {data.length > 0 && !loading && (
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.item}>
                                    <Text style={styles.itemText}>ID: {item.id}</Text>
                                    <Text style={styles.itemText}>Name: {item.vehicle_number}</Text>
                                    <Text style={styles.itemText}>Agreed Amount: {item.agreed_amount}</Text>
                                    <Text style={styles.itemText}>Profit: {item.agreed_amount - item.total_expenses}</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ExportData;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 20,
    },
    welcomeContainer: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingLeft: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    username: {
        marginTop: 30,
        marginLeft: -35,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'darkslategrey'
    },

    helloname: {
        marginTop: -5,
        marginLeft: 10,
        fontSize: 14,
    },

    usrimg: {
        marginLeft:3,
        marginTop: 20
    },

    logoutimg: {
        marginTop: -30,
        marginLeft:330,
        width:25,
        height:25
    },
    button: {
        backgroundColor: '#841584',
        paddingVertical: 12,
        borderRadius: 15,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonledger: {
        backgroundColor: '#841584',
        paddingVertical: 12,
        borderRadius: 15,
        width: 150,
        height:42,
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
        marginTop: 1,
        width: '100%',
        alignItems: 'center',
    },
    exportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 20,
    },
    noDataText: {
        fontSize: 18,
        color: '#ff5722',
        marginTop: 20,
    },
    item: {
        marginVertical: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: 300,
        backgroundColor: '#fff',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    totalContainer: {
        marginTop: 10,
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
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    pickerItemStyle: {
        height: 44,
        fontSize: 16,
        color: 'black',
        fontWeight: 'condensedBold'
    },
});

// import React, { useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Alert, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
// import { Picker } from '@react-native-picker/picker';  
// import { globalState } from '@/src/globalState';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// const ExportData = () => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [customername, setCustomername] = useState('');
//     const [month, setMonth] = useState('');
//     const [searchInitiated, setSearchInitiated] = useState(false);
//     const [totalAgreedAmount, setTotalAgreedAmount] = useState(0);
//     const [totalExpenses, setTotalExpenses] = useState(0);
//     const [profit, setProfit] = useState(0);
//     const UserName = globalState.UserName;

//     const fetchData = async () => {
//         if (!customername.trim()) {
//             Alert.alert('Please Enter Customer Name');
//             return;
//         }

//         setLoading(true);
//         setSearchInitiated(true);

//         try {
//             const response = await fetch(`http://192.168.1.203:3000/search?customername=${encodeURIComponent(customername.trim())}`);
//             const result = await response.json();

//             if (response.ok) {
//                 setData(result);
//             } else {
//                 Alert.alert('Error', result.message || 'No records found.');
//                 setData([]); // Reset data if no records found
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const exportLastMonthData = async () => {
//         if (!month) {
//             Alert.alert('Please select a month');
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await fetch(`http://192.168.1.203:3000/export-month?month=${month}`);
//             const result = await response.json();

//             if (response.ok) {
//                 setData(result.results);
//                 setTotalAgreedAmount(result.totalAgreedAmount);
//                 setTotalExpenses(result.totalExpenses);
//                 setProfit(result.profit);
//             } else {
//                 Alert.alert('Error', result.message || 'An error occurred');
//             }
//         } catch (error) {
//             console.error("Error fetching export data:", error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <SafeAreaProvider>
//             <SafeAreaView style={styles.safeArea}>
//                 <View style={styles.headerContainer}>
//                     <Image
//                         style={styles.usrimg}
//                         source={require("../assets/images/usericon.png")}
//                     />
//                     <View style={styles.welcomeContainer}>
//                         <Text style={styles.helloname}>Hello,</Text>
//                         <Text style={styles.username}>{UserName}</Text>
//                     </View>
//                     <TouchableOpacity>
//                         <Image
//                             style={styles.logoutimg}
//                             source={require("../assets/images/Logout.png")}
//                         />
//                     </TouchableOpacity>
//                 </View>

//                 <View style={styles.container}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter Customer Name"
//                         value={customername}
//                         onChangeText={setCustomername}
//                     />
//                     <TouchableOpacity 
//                         onPress={fetchData} 
//                         style={styles.button}>
//                         <Text style={styles.buttonText}>Search</Text>
//                     </TouchableOpacity>

//                     {loading && <Text style={styles.loadingText}>Loading...</Text>}

//                     {searchInitiated && !loading && data.length === 0 && (
//                         <Text style={styles.noDataText}>No data available.</Text>
//                     )}

//                     {/* Export Data by Month */}
//                     <View style={styles.monthPickerContainer}>
//                         <Text style={styles.exportTitle}>Export Last Month Data</Text>
//                         <Picker
//                             selectedValue={month}
//                             onValueChange={(itemValue) => setMonth(itemValue)}
//                             style={styles.picker}
//                             dropdownIconColor='gray' 
//                             itemStyle={styles.pickerItemStyle} 
//                         >
//                             <Picker.Item label="Select Month" value="" />
//                             <Picker.Item label="January" value="01" />
//                             <Picker.Item label="February" value="02" />
//                             <Picker.Item label="March" value="03" />
//                             <Picker.Item label="April" value="04" />
//                             <Picker.Item label="May" value="05" />
//                             <Picker.Item label="June" value="06" />
//                             <Picker.Item label="July" value="07" />
//                             <Picker.Item label="August" value="08" />
//                             <Picker.Item label="September" value="09" />
//                             <Picker.Item label="October" value="10" />
//                             <Picker.Item label="November" value="11" />
//                             <Picker.Item label="December" value="12" />
//                         </Picker>
//                         <TouchableOpacity 
//                             onPress={exportLastMonthData} 
//                             style={styles.button}>
//                             <Text style={styles.buttonText}>Export</Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Display Total Agreed Amount, Total Expenses, and Profit */}
//                     <View style={styles.totalContainer}>
//                         <Text style={styles.totalText}>Net Amount: Rs.{totalAgreedAmount.toFixed(2)}</Text>
//                         <Text style={styles.totalText}>Total Expenses: Rs.{totalExpenses.toFixed(2)}</Text>
//                         <Text style={styles.totalText}>Profit: Rs.{profit.toFixed(2)}</Text>
//                     </View>

//                     {/* Display Data Results Below the Export Button */}
//                     {data.length > 0 && !loading && (
//                         <FlatList
//                             data={data}
//                             keyExtractor={(item) => item.customer_name} // Ensure unique key
//                             renderItem={({ item }) => (
//                                 <View style={styles.item}>
//                                     <Text style={styles.itemText}>Customer Name: {item.customer_name}</Text>
//                                     <Text style={styles.itemText}>Amount: {item.amount ? item.amount.toFixed(2) : 'N/A'}</Text>
//                                     <Text style={styles.itemText}>Balance: {item.balance ? item.balance.toFixed(2) : 'N/A'}</Text>
//                                     <Text style={styles.itemText}>Transaction Date: {new Date(item.transaction_date).toLocaleString()}</Text>
//                                 </View>
//                             )}
//                         />
//                     )}
//                 </View>
//             </SafeAreaView>
//         </SafeAreaProvider>
//     );
// };

// // Add your styles here
// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#ffffff',
//     },
//     headerContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//     },
//     usrimg: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//     },
//     welcomeContainer: {
//         marginLeft: 10,
//     },
//     helloname: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     username: {
//         fontSize: 16,
//     },
//     container: {
//         padding: 20,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: 'gray',
//         borderRadius: 5,
//         padding: 10,
//         marginBottom: 10,
//     },
//     button: {
//         backgroundColor: '#841584',
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#ffffff',
//         fontWeight: 'bold',
//     },
//     loadingText: {
//         marginTop: 10,
//     },
//     noDataText: {
//         marginTop: 10,
//         color: 'red',
//     },
//     monthPickerContainer: {
//         marginTop: 20,
//     },
//     exportTitle: {
//         fontSize: 16,
//         marginBottom: 10,
//     },
//     totalContainer: {
//         marginTop: 20,
//     },
//     totalText: {
//         fontSize: 16,
//         marginVertical: 5,
//     },
//     item: {
//         padding: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: 'gray',
//     },
//     itemText: {
//         fontSize: 16,
//     },
// });

// export default ExportData;