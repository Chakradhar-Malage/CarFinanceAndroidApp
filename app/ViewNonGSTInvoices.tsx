// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, StyleSheet, Linking } from 'react-native';
// import axios from 'axios';
// // import globalState  from '@/src/globalState';
// import { useNavigation } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const ViewNonGSTInvoices = () => {
//     const [invoices, setInvoices] = useState([]);
//     const [searchName, setSearchName] = useState('');
//     const [filteredInvoices, setFilteredInvoices] = useState([]);
//     // const UserName = globalState.TempforViewing; // Replace with `globalState.TempforViewing` if needed
//     const navigation = useNavigation();

//     const FormattedDate = ({ dateString }) => {
//         // Create a new Date object from the received date string
//         const date = new Date(dateString);
    
//         // Extract the date components (year, month, day)
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
//         const year = date.getFullYear();
    
//         // Extract the time components (hours, minutes, seconds)
//         const hours = String(date.getHours()).padStart(2, '0');
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         const seconds = String(date.getSeconds()).padStart(2, '0');
    
//         // Format the date and time as desired (e.g., 'MM/DD/YYYY at HH:mm:ss')
//         const formattedDate = `${month}/${day}/${year}`;
//         const formattedTime = `${hours}:${minutes}:${seconds}`;
    
//         return (
//             <Text>
//                 {formattedDate} at {formattedTime}
//             </Text>
//         );
//     };

//     const formatDateForUrl = (dateString) => {
//         const date = new Date(dateString);
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         const hours = String(date.getHours()).padStart(2, '0');
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         const seconds = String(date.getSeconds()).padStart(2, '0');
    
//         return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//     };
        
        
//     useEffect(() => {
//         fetchInvoices();
//     }, []);

//     const fetchInvoices = async () => {
//         try {
//             const response = await axios.get('http://15.207.48.53:3000/allnongstinvoices');
//             setInvoices(response.data);
//             setFilteredInvoices(response.data);
//         } catch (error) {
//             console.error('Error fetching invoices:', error);
//         }
//     };

//     const searchByCustomer = async () => {
//         if (!searchName) {
//             Alert.alert('Please enter a customer name.');
//             return;
//         }

//         try {
//             const response = await axios.get(
//                 `http://15.207.48.53:3000/nongstinvoices/customer/${searchName}`
//             );
//             setFilteredInvoices(response.data);
//         } catch (error) {
//             console.error('Error searching invoices:', error);
//             Alert.alert('No invoices found for this customer.');
//         }
//     };

//     const downloadInvoice = async (invoicePdf) => {
//         try {
//             const response = await axios.get(
//                 `http://15.207.48.53:3000/invoices/${invoicePdf}/download`,
//                 { responseType: 'blob' }
//             );
//             console.log('Invoice downloaded successfully:', invoicePdf);
//         } catch (error) {
//             console.error('Error downloading invoice:', error);
//         }
//     };

//     const openInBrowser = (customerName, createdAt) => {
//         const formattedDate = formatDateForUrl(createdAt);  // Format the date to match the required format
//         const encodedCreatedAt = encodeURIComponent(formattedDate);  // Encode the formatted date
//         const url = `http://15.207.48.53:3000/nongstinvoices/${customerName}/${encodedCreatedAt}/download`;
    
//         console.log("Download URL:", url);
//         // Open the URL in the browser
//         Linking.openURL(url).catch((err) => console.error('Failed to open URL', err));
//     };

//     const renderInvoice = ({ item }) => (
//         <View style={styles.invoiceItem}>
//             <Text style={styles.invoiceText}>Customer: {item.customer_name}</Text>
//             {/* <Text style={styles.invoiceText}>Created At: {item.created_at}</Text> */}
//             <FormattedDate dateString={item.created_at} />
//             <TouchableOpacity
//                 style={styles.downloadButton}
//                 onPress={() => openInBrowser(item.customer_name, item.created_at)} // Pass customer name and created_at
//             >
//                 <Text style={styles.buttonText}>Download</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <View style={{ flex: 1, padding: 20 }}>
//             {/* Header with User Info */}
//             <SafeAreaView>
//             <View style={styles.headerContainer}>
//                 <Image 
//                     style={styles.usrimg}
//                     source={require("../assets/images/usericon.png")} 
//                 />
//                 <View style={styles.userInfo}>
//                     <Text style={styles.helloname}>Hello,</Text>
//                     <Text style={styles.username}>OmSai</Text>
//                 </View>
//             </View>
//             </SafeAreaView>

//             <Text style={{fontWeight:'bold'}}>This is Non GST section</Text>

//             {/* View Invoices Button */}
//             {/* Buttons container with flexDirection: 'row' */}
//             <View style={styles.buttonsContainer}>
//                 <TouchableOpacity onPress={() => navigation.navigate('GenerateNonGSTInvoice')} style={styles.viewInvoicesButton}>
//                     <Text style={styles.viewInvoicesText}>New Invoice</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => navigation.navigate('NonGstBilling_ledger')} style={styles.viewInvoicesButton}>
//                     <Text style={styles.viewInvoicesText}>Billing Ledger</Text>
//                 </TouchableOpacity>
//             </View>
//             {/* Search Section */}
//             <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search by customer name"
//                 value={searchName}
//                 onChangeText={setSearchName}
//             />
//             <TouchableOpacity style={styles.searchButton} onPress={searchByCustomer}>
//                 <Text style={styles.buttonText}>Search</Text>
//             </TouchableOpacity>

//             {/* Invoice List */}
//             <FlatList
//                 data={filteredInvoices}
//                 keyExtractor={(item, index) => index.toString()} 
//                 renderItem={renderInvoice}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     // Header Styles
//     headerContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     usrimg: {
//         width: 50,
//         height: 50,
//         borderRadius: 20,
//     },
//     userInfo: {
//         marginLeft: 10,
//     },
//     helloname: {
//         fontSize: 14,
//         color: 'gray',
//     },
//     username: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: 'darkslategrey',
//     },

//     // Invoice Styles
//     invoiceItem: {
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: 'gray',
//         backgroundColor: '#f9f9f9',
//         marginVertical: 8,
//         borderRadius: 5,
//     },
//     invoiceText: {
//         fontSize: 16,
//         marginBottom: 8,
//     },
//     downloadButton: {
//         backgroundColor: 'darkslategrey',
//         padding: 10,
//         borderRadius: 5,
//         marginTop: 10,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//     },

//     // Search Styles
//     searchInput: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 12,
//         paddingHorizontal: 8,
//         borderRadius: 5,
//     },
//     searchButton: {
//         backgroundColor: '#841584',
//         paddingVertical: 10, // Adjust padding if needed
//         borderRadius: 5,
//         marginBottom: 20,
//         alignItems: 'center',   // Center horizontally
//         justifyContent: 'center', // Center vertically
//     },

//     viewInvoicesButton: {
//         padding: 10,
//         // marginBottom: 20,
//         width:'48%',
//         backgroundColor: '#841584',
//         borderRadius: 18,
//     },

//     buttonsContainer: {
//         flexDirection: 'row',  // This makes the buttons appear side by side
//         justifyContent: 'space-between', // Space between buttons
//         marginBottom: 20,  // Adjust the margin if needed
//     },

//     viewInvoicesText: {
//         color: 'white',
//         fontSize: 16,
//         textAlign: 'center',
//     },
// });

// export default ViewNonGSTInvoices;


import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, StyleSheet, Linking 
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for icons
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewNonGSTInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const navigation = useNavigation();

  // Component to format a date string for display (MM/DD/YYYY at HH:mm:ss)
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
    return <Text>{formattedDate} at {formattedTime}</Text>;
  };

  // Function to format a date string for use in URLs (YYYY-MM-DD HH:mm:ss)
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

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://15.207.48.53:3000/allnongstinvoices');
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
        `http://15.207.48.53:3000/nongstinvoices/customer/${searchName}`
      );
      setFilteredInvoices(response.data);
    } catch (error) {
      console.error('Error searching invoices:', error);
      Alert.alert('No invoices found for this customer.');
    }
  };

  // Function to open the download URL in the browser
  const openInBrowser = (customerName, createdAt) => {
    const formattedDate = formatDateForUrl(createdAt);
    const encodedCreatedAt = encodeURIComponent(formattedDate);
    const url = `http://15.207.48.53:3000/nongstinvoices/${customerName}/${encodedCreatedAt}/download`;
    // console.log("Download URL:", url);
    Linking.openURL(url).catch((err) => console.error('Failed to open URL', err));
  };

  // Delete function for non-GST invoices
  const deleteNonGstInvoice = async (customerName, createdAt) => {
    // Format and encode the timestamp just as in the download URL
    const formattedDate = formatDateForUrl(createdAt);  
    const encodedCreatedAt = encodeURIComponent(formattedDate);
    // Endpoint for deletion; adjust if your backend endpoint differs
    const url = `http://15.207.48.53:3000/deleteNonGstinvoices/${customerName}/${encodedCreatedAt}`;
    try {
      await axios.delete(url);
      Alert.alert('Invoice deleted successfully');
      // Update local state by removing the deleted invoice
      setInvoices(prev => prev.filter(invoice => invoice.customer_name !== customerName || invoice.created_at !== createdAt));
      setFilteredInvoices(prev => prev.filter(invoice => invoice.customer_name !== customerName || invoice.created_at !== createdAt));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      Alert.alert('Failed to delete invoice');
    }
  };

  // Render each invoice card with a delete icon and a download button
  const renderInvoice = ({ item }) => (
    <View style={styles.invoiceItem}>
      {/* Delete Icon positioned at the top-right */}
      <TouchableOpacity 
        style={styles.deleteIcon}
        onPress={() => deleteNonGstInvoice(item.customer_name, item.created_at)}
      >
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>

      <Text style={styles.invoiceText}>Customer: {item.customer_name}</Text>
      <FormattedDate dateString={item.created_at} />
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => openInBrowser(item.customer_name, item.created_at)}
      >
        <Text style={styles.buttonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

  return (
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

      <Text style={{ fontWeight:'bold' }}>This is Non GST section</Text>

      {/* Navigation Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('GenerateNonGSTInvoice')} 
          style={styles.viewInvoicesButton}
        >
          <Text style={styles.viewInvoicesText}>New Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('NonGstBilling_ledger')} 
          style={styles.viewInvoicesButton}
        >
          <Text style={styles.viewInvoicesText}>Billing Ledger</Text>
        </TouchableOpacity>
      </View>

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

  // Invoice Card Styles
  invoiceItem: {
    position: 'relative', // For absolute positioning of the delete icon
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
  deleteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
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

  // Search and Navigation Styles
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
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewInvoicesButton: {
    padding: 10,
    width: '48%',
    backgroundColor: '#841584',
    borderRadius: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  viewInvoicesText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ViewNonGSTInvoices;
