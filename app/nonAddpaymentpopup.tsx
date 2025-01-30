import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, 
    BackHandler
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';


const nonAddPaymentPopup = () => {
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        fetchCustomerNames();
    }, []);

    const fetchCustomerNames = async () => {
        try {
            const response = await axios.get('http://15.207.48.53:3000/nongstcustomer');
            const customers = response.data.map(customer => ({
                label: customer.name,
                value: customer.name
            }));
            setCustomerList(customers);
        } catch (error) {
            console.error('Error fetching customer names:', error);
        }
    };

    const handleSave = async () => {
        setError('');
        if (!selectedCustomer || !paymentAmount) {
            setError('Please fill all fields.');
            return;
        }

        try {
            const response = await axios.post('http://15.207.48.53:3000/nonaddPayment', { 
                customer_id: selectedCustomer,
                amount: parseFloat(paymentAmount),
                method: paymentMethod,
            });
            console.log('Payment added successfully:', response.data);
            clearForm();
        } catch (error) {
            console.error('Error adding payment:', error);
            setError('Failed to add payment. Please try again.');
        }
    };

    const clearForm = () => {
        setSelectedCustomer(null);
        setPaymentAmount('');
        setPaymentMethod('cash');
        setOpen(false);
        setError('');
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>

                    <Text style={styles.title}>Add Payment</Text>

                    {/* Dropdown Picker for Selecting Customer */}
                    <View style={{ zIndex: 1000 }}>
                        <DropDownPicker
                            open={open}
                            value={selectedCustomer}
                            items={customerList}
                            setOpen={setOpen}
                            setValue={setSelectedCustomer}
                            setItems={setCustomerList}
                            placeholder="Select Customer"
                            style={styles.dropdown}
                            zIndex={3000}
                            zIndexInverse={1000}
                        />
                    </View>

                    {/* Payment Amount Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Payment Amount"
                        keyboardType="numeric"
                        value={paymentAmount}
                        onChangeText={setPaymentAmount}
                    />

                    {/* Payment Method Selection */}
                    <View style={styles.radioGroup}>
                        <Text style={styles.radioLabel}>Payment Method:</Text>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="cash"
                                status={paymentMethod === 'cash' ? 'checked' : 'unchecked'}
                                onPress={() => setPaymentMethod('cash')}
                            />
                            <Text>Cash</Text>
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="bankTransfer"
                                status={paymentMethod === 'bankTransfer' ? 'checked' : 'unchecked'}
                                onPress={() => setPaymentMethod('bankTransfer')}
                            />
                            <Text>Bank Transfer</Text>
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="upi"
                                status={paymentMethod === 'upi' ? 'checked' : 'unchecked'}
                                onPress={() => setPaymentMethod('upi')}
                            />
                            <Text>UPI</Text>
                        </View>
                    </View>

                    {/* Error Message */}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={clearForm}>
                            <Text style={styles.buttonText}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default nonAddPaymentPopup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        marginTop: 25
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    radioGroup: {
        marginBottom: 10,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    radioLabel: {
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#841584',
        padding: 10,
        borderRadius: 5,
        width: '45%',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    dropdown: {
        width: '100%',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
    backButtonText: {
        fontSize: 16,
        color: '#841584',
        marginBottom: 10,
    },
});