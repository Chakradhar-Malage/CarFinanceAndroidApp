import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { globalState } from '@/src/globalState';
import { useNavigation } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Linking } from 'react-native';



const ViewInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const UserName = globalState.TempforViewing; // Replace with `globalState.TempforViewing` if needed
    const navigation = useNavigation();

    // Formatted Date Component
    const FormattedDate = ({ dateString }) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const formattedDate = `${month}/${day}/${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        return (
            <Text>
                {formattedDate} at {formattedTime}
            </Text>
        );
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://15.207.48.53:3000/allgeneratorquotations');
            setInvoices(response.data);
            setFilteredInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const searchByCustomer = async () => {
        if (!searchName) {
            Alert.alert('Please enter a customer name.');
            return;
        }

        try {
            const response = await axios.get(
                `http://15.207.48.53:3000/generator-quotations/customer/${searchName}`
            );
            setFilteredInvoices(response.data);
        } catch (error) {
            console.error('Error searching invoices:', error);
            Alert.alert('No invoices found for this customer.');
        }
    };


    const formatDateForUrl = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    
    const openInBrowser = (customerName, createdAt) => {
        const formattedDate = formatDateForUrl(createdAt);  // Format the date to match the required format
        const encodedCreatedAt = encodeURIComponent(formattedDate);  // Encode the formatted date
        const url = `http://15.207.48.53:3000/generator-quotations/${customerName}/${encodedCreatedAt}/download`;
    
        console.log("Download URL:", url);
        // Open the URL in the browser
        Linking.openURL(url).catch((err) => console.error('Failed to open URL', err));
    };
    

    const renderInvoice = ({ item }) => (
        <View style={styles.invoiceItem}>
            <Text style={styles.invoiceText}>Customer: {item.customer_name}</Text>
            <FormattedDate dateString={item.created_at} />
            <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => openInBrowser(item.customer_name, item.created_at)} // Pass customer name and created_at
            >
                <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaProvider>
        <View style={{ flex: 1, padding: 20 }}>
            {/* Header with User Info */}
            <SafeAreaView>
            <View style={styles.headerContainer}>
                <Image 
                    style={styles.usrimg}
                    source={require("../assets/images/usericon.png")} 
                />
                <View style={styles.userInfo}>
                    <Text style={styles.helloname}>Hello,</Text>
                    <Text style={styles.username}>OmSai</Text>
                </View>
            </View>
            </SafeAreaView>

            {/* View Invoices Button */}

            <Text style={{fontWeight:'bold'}}>Generator Quotations</Text>

            <TouchableOpacity onPress={() => navigation.navigate('generateGeneratorQuotation')} style={styles.viewInvoicesButton}>
                <Text style={styles.viewInvoicesText}>New Quotation</Text>
            </TouchableOpacity>
            {/* Search Section */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search by customer name"
                value={searchName}
                onChangeText={setSearchName}
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchByCustomer}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>

            {/* Invoice List */}
            <FlatList
                data={filteredInvoices}
                keyExtractor={(item, index) => index.toString()} 
                renderItem={renderInvoice}
            />
        </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    // Header Styles
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    usrimg: {
        width: 50,
        height: 50,
        borderRadius: 20,
    },
    userInfo: {
        marginLeft: 10,
    },
    helloname: {
        fontSize: 14,
        color: 'gray',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'darkslategrey',
    },

    // Invoice Styles
    invoiceItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        backgroundColor: '#f9f9f9',
        marginVertical: 8,
        borderRadius: 5,
    },
    invoiceText: {
        fontSize: 16,
        marginBottom: 8,
    },
    downloadButton: {
        backgroundColor: 'darkslategrey',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },

    // Search Styles
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    searchButton: {
        backgroundColor: '#841584',
        paddingVertical: 10, // Adjust padding if needed
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',   // Center horizontally
        justifyContent: 'center', // Center vertically
    },

    viewInvoicesButton: {
        padding: 10,
        marginBottom: 15,
        width:'50%',
        backgroundColor: '#841584',
        borderRadius: 18,
        marginTop: 15
    },
    viewInvoicesText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ViewInvoices;
