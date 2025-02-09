// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, StyleSheet, SafeAreaView } from 'react-native';
// import axios from 'axios';
// import { globalState } from '@/src/globalState';
// import { useNavigation } from 'expo-router';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { Linking } from 'react-native';



// const ViewInvoices = () => {
//     const [invoices, setInvoices] = useState([]);
//     const [searchName, setSearchName] = useState('');
//     const [filteredInvoices, setFilteredInvoices] = useState([]);
//     const UserName = globalState.TempforViewing; // Replace with `globalState.TempforViewing` if needed
//     const navigation = useNavigation();

//     // Formatted Date Component
//     const FormattedDate = ({ dateString }) => {
//         const date = new Date(dateString);
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
//         const year = date.getFullYear();
//         const hours = String(date.getHours()).padStart(2, '0');
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         const seconds = String(date.getSeconds()).padStart(2, '0');

//         const formattedDate = `${month}/${day}/${year}`;
//         const formattedTime = `${hours}:${minutes}:${seconds}`;

//         return (
//             <Text>
//                 {formattedDate} at {formattedTime}
//             </Text>
//         );
//     };

//     useEffect(() => {
//         fetchInvoices();
//     }, []);

//     const fetchInvoices = async () => {
//         try {
//             const response = await axios.get('http://15.207.48.53:3000/allinvoices');
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
//                 `http://15.207.48.53:3000/invoices/customer/${searchName}`
//             );
//             setFilteredInvoices(response.data);
//         } catch (error) {
//             console.error('Error searching invoices:', error);
//             Alert.alert('No invoices found for this customer.');
//         }
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
    
//     const openInBrowser = (customerName, createdAt) => {
//         const formattedDate = formatDateForUrl(createdAt);  // Format the date to match the required format
//         const encodedCreatedAt = encodeURIComponent(formattedDate);  // Encode the formatted date
//         const url = `http://15.207.48.53:3000/invoices/${customerName}/${encodedCreatedAt}/download`;
    
//         // console.log("Download URL:", url);
//         // Open the URL in the browser
//         Linking.openURL(url).catch((err) => console.error('Failed to open URL', err));
//     };
    

//     const renderInvoice = ({ item }) => (
//         <View style={styles.invoiceItem}>
//             <Text style={styles.invoiceText}>Customer: {item.customer_name}</Text>
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
//         <SafeAreaProvider>
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
//             {/* View Invoices Button */}
//             {/* Buttons container with flexDirection: 'row' */}
//             <View style={styles.buttonsContainer}>
//                 <TouchableOpacity onPress={() => navigation.navigate('GenerateInvoice')} style={styles.viewInvoicesButton}>
//                     <Text style={styles.viewInvoicesText}>New Invoice</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => navigation.navigate('GstBilling_ledger')} style={styles.viewInvoicesButton}>
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
//         </SafeAreaProvider>
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

//     buttonsContainer: {
//         flexDirection: 'row',  // This makes the buttons appear side by side
//         justifyContent: 'space-between', // Space between buttons
//         marginBottom: 20,  // Adjust the margin if needed
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
//     viewInvoicesText: {
//         color: 'white',
//         fontSize: 16,
//         textAlign: 'center',
//     },
// });

// export default ViewInvoices;


import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, StyleSheet, SafeAreaView 
} from 'react-native';
import axios from 'axios';
import { globalState } from '@/src/globalState';
import { useNavigation } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the FontAwesome icon set

const ViewInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const UserName = globalState.TempforViewing; // Replace if needed
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
      const response = await axios.get('http://15.207.48.53:3000/allinvoices');
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
        `http://15.207.48.53:3000/invoices/customer/${searchName}`
      );
      setFilteredInvoices(response.data);
    } catch (error) {
      console.error('Error searching invoices:', error);
      Alert.alert('No invoices found for this customer.');
    }
  };

  // Helper function to format date for URL usage
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

  // Function to open the invoice in the browser (for download)
  const openInBrowser = (customerName, createdAt) => {
    const formattedDate = formatDateForUrl(createdAt);  // Format the date to match the required format
    const encodedCreatedAt = encodeURIComponent(formattedDate);  // Encode the formatted date
    const url = `http://15.207.48.53:3000/invoices/${customerName}/${encodedCreatedAt}/download`;

    // Open the URL in the browser
    Linking.openURL(url).catch((err) => console.error('Failed to open URL', err));
  };

  // Function to delete an invoice from the database
  const deleteInvoice = async (customerName, createdAt) => {
    const formattedDate = formatDateForUrl(createdAt);
    const encodedCreatedAt = encodeURIComponent(formattedDate);
    const url = `http://15.207.48.53:3000/deleteinvoices/${customerName}/${encodedCreatedAt}`;

    try {
      await axios.delete(url);
      // Remove the deleted invoice from state so UI updates immediately
      setInvoices(prevInvoices =>
        prevInvoices.filter(
          invoice => !(invoice.customer_name === customerName && invoice.created_at === createdAt)
        )
      );
      setFilteredInvoices(prevInvoices =>
        prevInvoices.filter(
          invoice => !(invoice.customer_name === customerName && invoice.created_at === createdAt)
        )
      );
      Alert.alert('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      Alert.alert('Failed to delete invoice');
    }
  };

  // Render each invoice as a card with a Download button and a top-right Delete (bin) icon
  const renderInvoice = ({ item }) => (
    <View style={styles.invoiceItem}>
      {/* Delete Icon */}
      <TouchableOpacity 
        style={styles.deleteIcon}
        onPress={() => deleteInvoice(item.customer_name, item.created_at)}
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

        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('GenerateInvoice')} style={styles.viewInvoicesButton}>
            <Text style={styles.viewInvoicesText}>New Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('GstBilling_ledger')} style={styles.viewInvoicesButton}>
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
    position: 'relative', // Needed for absolute positioning of the delete icon
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
    textAlign: 'center',
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

  buttonsContainer: {
    flexDirection: 'row',  // Side-by-side buttons
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  searchButton: {
    backgroundColor: '#841584',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },

  viewInvoicesButton: {
    padding: 10,
    width: '48%',
    backgroundColor: '#841584',
    borderRadius: 18,
  },
  viewInvoicesText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ViewInvoices;

