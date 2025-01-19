
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TextInput, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const CustomerLedger = () => {
    const [ledgerData, setLedgerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [transactionType, setTransactionType] = useState('credit');
    const [modifyAmounts, setModifyAmounts] = useState([]);
    const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(null);

    useEffect(() => {
        const fetchLedgerData = async () => {
            try {
                const response = await fetch('http://15.207.48.53:3000/getLedgerData');
                const result = await response.json();

                if (response.ok) {
                    setLedgerData(result);
                    setModifyAmounts(new Array(result.length).fill(''));
                } else {
                    setError(result.message || 'Failed to fetch ledger data');
                }
            } catch (error) {
                console.error('Error fetching ledger data:', error);
                setError('An error occurred while fetching ledger data');
            } finally {
                setLoading(false);
            }
        };

        fetchLedgerData();
    }, []);

    const handleModifyPayment = () => {
        if (selectedCustomerIndex === null) return;

        const modifyAmount = parseFloat(modifyAmounts[selectedCustomerIndex]);
        if (isNaN(modifyAmount)) {
            Alert.alert('Error', 'Please enter a valid numeric value for the amount.');
            return;
        }

        const updatedData = [...ledgerData];
        const currentBalance = updatedData[selectedCustomerIndex].balance;

        if (transactionType === 'credit') {
            updatedData[selectedCustomerIndex].balance = currentBalance + modifyAmount;
        } else {
            updatedData[selectedCustomerIndex].balance = currentBalance - modifyAmount;
        }

        const requestBody = {
            customer_name: updatedData[selectedCustomerIndex].customer_name,
            modifyAmount: modifyAmount,
            transactionType: transactionType,
        };

        fetch('http://15.207.48.53:3000/saveCustomerLedger', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    Alert.alert('Success', data.message);
                    setLedgerData(updatedData);
                    setModifyAmounts(prev => {
                        const newAmounts = [...prev];
                        newAmounts[selectedCustomerIndex] = '';
                        return newAmounts;
                    });
                    setSelectedCustomerIndex(null);
                } else {
                    Alert.alert('Error', data.error || 'Failed to update ledger');
                }
            })
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'An error occurred while saving the ledger');
            });
    };

    const renderLedgerItem = ({ item, index }) => {
        const balance = Number(item.balance) || 0;

        return (
            <View style={styles.item}>
                <Text style={styles.itemText}>Customer Name: {item.customer_name}</Text>
                <Text style={styles.itemText}>Balance: {balance.toFixed(2)}</Text>
                <Text style={styles.itemText}>Last Transaction Date: {new Date(item.transaction_date).toLocaleString()}</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Modify Payment"
                    keyboardType="numeric"
                    value={modifyAmounts[index]}
                    onChangeText={(text) => {
                        const updatedAmounts = [...modifyAmounts];
                        updatedAmounts[index] = text;
                        setModifyAmounts(updatedAmounts);
                    }}
                />

                <View style={styles.transactionButtons}>
                    <Button
                        title="Credit"
                        onPress={() => {
                            setTransactionType('credit');
                            setSelectedCustomerIndex(index);
                        }}
                    />
                    <Button
                        title="Debit"
                        onPress={() => {
                            setTransactionType('debit');
                            setSelectedCustomerIndex(index);
                        }}
                    />
                </View>

                <Button
                    title="Save"
                    onPress={handleModifyPayment}
                    disabled={selectedCustomerIndex !== index}
                />
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <ActivityIndicator size="large" color="#841584" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (error) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <View>
                    <Text style={styles.errorText}>{error}</Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <Image
                style={styles.usrimg}
                source={require('../assets/images/usericon.png')}
                className="size-12 rounded-full"
            />
            <View className="flex flex-col items-start ml-2 justify-center">
                <Text style={styles.helloname}>Hello,</Text>
            </View>
            <View><Text style={styles.username}>OmSai</Text></View>
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
            <SafeAreaView style={styles.safeArea}>
                <ScrollView> {/* Wrap FlatList with ScrollView */}
                    <FlatList
                        data={ledgerData}
                        keyExtractor={(item) => item.transaction_date}
                        renderItem={renderLedgerItem}
                        contentContainerStyle={styles.listContainer}
                    />
                </ScrollView> {/* Wrap FlatList with ScrollView */}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

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
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    listContainer: {
        padding: 20,
    },
    item: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        marginVertical: 5,
    },
    transactionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default CustomerLedger;