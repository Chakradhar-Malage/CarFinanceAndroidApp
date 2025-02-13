// import React from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { useNavigation } from 'expo-router';
// import { globalState } from '@/src/globalState';

// const personalBankAccountTracking = () => {
//   const navigation = useNavigation();
//   const UserName = globalState.UserName;

//   // Dummy account balance data
//   const accountBalances = {
//     'Pavana Bank': 5000000,
//     'IDBI Bank': 3000,
//     'Cash': 1000,
//   };

//   // Handler functions for button presses
//   const handleAddNewBank = () => {
//     // Add navigation or modal logic here
//     console.log('Add New Bank pressed');
//   };

//   const handleRemoveBank = () => {
//     // Add remove bank logic or confirmation modal here
//     console.log('Remove Bank pressed');
//   };

//   const handleBankPress = (bankName) => {
//     // Navigate to the AccountDetails page and pass the bankName as a parameter
//     navigation.navigate('bankAccountDetails', { bankName });
//     // OR if you're using expo-router's file-based routing:
//     // router.push(`/accountDetails?bankName=${bankName}`);
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <SafeAreaView>
//         {/* User Info Section */}
//         <View style={styles.headerContainer}>
//           <Image
//             style={styles.usrimg}
//             source={require('../assets/images/usericon.png')}
//           />
//           <View style={styles.userInfo}>
//             <Text style={styles.helloname}>Hello,</Text>
//             <Text style={styles.username}>{UserName}</Text>
//           </View>
//           <TouchableOpacity onPress={() => console.log('Logout pressed')}>
//             <Image
//               style={styles.logoutimg}
//               source={require('../assets/images/Logout.png')}
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.separator} />

//         {/* Top Buttons Section */}
//         <View style={styles.topButtonsContainer}>
//           <TouchableOpacity style={styles.topButton} onPress={handleAddNewBank}>
//             <Text style={styles.topButtonText}>Add New Bank</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.topButton} onPress={handleRemoveBank}>
//             <Text style={styles.topButtonText}>Remove Bank</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Bank Accounts List Section */}
//         <View style={styles.bankListContainer}>
//           <TouchableOpacity
//             style={styles.bankItem}
//             onPress={() => handleBankPress('Pavana Bank')}
//           >
//             <Text style={styles.bankText}>Pavana Bank</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.bankItem}
//             onPress={() => handleBankPress('IDBI Bank')}
//           >
//             <Text style={styles.bankText}>IDBI Bank</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.bankItem}
//             onPress={() => handleBankPress('Cash')}
//           >
//             <Text style={styles.bankText}>Cash</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Account Balance Card */}
//         <View style={styles.cardContainer}>
//           <Text style={styles.cardTitle}>Current Account Balances</Text>
//           {Object.keys(accountBalances).map((bank) => (
//             <View key={bank} style={styles.balanceItem}>
//               <Text style={styles.bankName}>{bank}</Text>
//               <Text style={styles.bankBalance}>
//                 Rs. {accountBalances[bank]}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// export default personalBankAccountTracking;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//   },
//   usrimg: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   userInfo: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   helloname: {
//     fontSize: 14,
//     color: '#333',
//   },
//   username: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'darkslategrey',
//   },
//   logoutimg: {
//     width: 25,
//     height: 25,
//   },
//   separator: {
//     borderBottomColor: 'rgb(0,0,0)',
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     marginHorizontal: 20,
//     marginVertical: 10,
//   },
//   topButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 10,
//   },
//   topButton: {
//     backgroundColor: '#841584',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   topButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   bankListContainer: {
//     marginHorizontal: 20,
//     marginTop: 20,
//   },
//   bankItem: {
//     backgroundColor: '#f9f9f9',
//     padding: 15,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginBottom: 10,
//   },
//   bankText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   cardContainer: {
//     margin: 20,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   balanceItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   bankName: {
//     fontSize: 16,
//     color: '#333',
//     flex: 1, // Allow the bank name to take space without overflowing
//   },
//   bankBalance: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     flexShrink: 1, // Allow the balance to shrink if necessary
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { globalState } from '@/src/globalState';

const personalBankAccountTracking = () => {
  const navigation = useNavigation();
  const UserName = globalState.UserName;

  // State to hold the list of bank accounts from the API
  const [accounts, setAccounts] = useState([]);

  // State for modals: Add New Bank and Remove Bank
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');

  const [showRemoveBankModal, setShowRemoveBankModal] = useState(false);
  const [removeBankName, setRemoveBankName] = useState('');

  // Fetch the list of accounts from the API
  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://15.207.48.53:3000/api/accounts');
      if (!response.ok) {
        console.error('Error fetching accounts');
        return;
      }
      const data = await response.json();
      setAccounts(data.accounts);
    } catch (error) {
      console.error('Fetch accounts error:', error);
    }
  };

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handler for "Add New Bank" button – opens the Add Bank modal
  const handleAddNewBank = () => {
    setShowAddBankModal(true);
  };

  // Handler for submitting a new bank account
  const handleSubmitAddBank = async () => {
    if (!newBankName || !openingBalance || isNaN(openingBalance)) {
      Alert.alert('Validation Error', 'Please enter a valid bank name and opening balance');
      return;
    }
    const payload = {
      name: newBankName,
      opening_balance: parseFloat(openingBalance),
    };

    try {
      const response = await fetch('http://15.207.48.53:3000/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Something went wrong');
        return;
      }
      const data = await response.json();
      Alert.alert('Success', 'Bank account added successfully');
      setShowAddBankModal(false);
      setNewBankName('');
      setOpeningBalance('');
      fetchAccounts(); // Refresh accounts list
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Unable to add bank account at this time');
    }
  };

  // Handler for "Remove Bank" button – opens the Remove Bank modal
  const handleRemoveBank = () => {
    setShowRemoveBankModal(true);
  };

  // Handler for submitting bank removal
  const handleSubmitRemoveBank = async () => {
    if (!removeBankName) {
      Alert.alert('Validation Error', 'Please enter a valid bank name');
      return;
    }
    try {
      const response = await fetch('http://15.207.48.53:3000/api/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankName: removeBankName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Something went wrong');
        return;
      }
      const data = await response.json();
      Alert.alert('Success', 'Bank account removed successfully');
      setShowRemoveBankModal(false);
      setRemoveBankName('');
      fetchAccounts(); // Refresh accounts list
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Unable to remove bank account at this time');
    }
  };

  // Handler for tapping on an account item
  const handleBankPress = (bankName) => {
    navigation.navigate('bankAccountDetails', { bankName });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Image style={styles.usrimg} source={require('../assets/images/usericon.png')} />
          <View style={styles.userInfo}>
            <Text style={styles.helloname}>Hello,</Text>
            <Text style={styles.username}>{UserName}</Text>
          </View>
          <TouchableOpacity onPress={() => console.log('Logout pressed')}>
            <Image style={styles.logoutimg} source={require('../assets/images/Logout.png')} />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        {/* Top Buttons Section */}
        <View style={styles.topButtonsContainer}>
          <TouchableOpacity style={styles.topButton} onPress={handleAddNewBank}>
            <Text style={styles.topButtonText}>Add New Bank</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topButton} onPress={handleRemoveBank}>
            <Text style={styles.topButtonText}>Remove Bank</Text>
          </TouchableOpacity>
        </View>

        {/* Bank Accounts List Section */}
        <ScrollView style={styles.bankListContainer}>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={styles.bankItem}
                onPress={() => handleBankPress(account.name)}
              >
                <Text style={styles.bankText}>{account.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noAccountsText}>No accounts available</Text>
          )}
        </ScrollView>

        {/* Account Balance Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Current Account Balances</Text>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <View key={account.id} style={styles.balanceItem}>
                <Text style={styles.bankName}>{account.name}</Text>
                <Text style={styles.bankBalance}>Rs. {account.current_balance}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noAccountsText}>No account balances available</Text>
          )}
        </View>

        {/* Add Bank Modal */}
        <Modal visible={showAddBankModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add New Bank</Text>
              <TextInput
                style={styles.input}
                placeholder="Bank Name"
                value={newBankName}
                onChangeText={setNewBankName}
              />
              <TextInput
                style={styles.input}
                placeholder="Opening Balance"
                keyboardType="numeric"
                value={openingBalance}
                onChangeText={setOpeningBalance}
              />
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.modalButton} onPress={() => setShowAddBankModal(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleSubmitAddBank}>
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Remove Bank Modal */}
        <Modal visible={showRemoveBankModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Remove Bank</Text>
              <TextInput
                style={styles.input}
                placeholder="Bank Name to Remove"
                value={removeBankName}
                onChangeText={setRemoveBankName}
              />
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.modalButton} onPress={() => setShowRemoveBankModal(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleSubmitRemoveBank}>
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default personalBankAccountTracking;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  usrimg: { width: 50, height: 50, borderRadius: 25 },
  userInfo: { marginLeft: 10, flex: 1 },
  helloname: { fontSize: 14, color: '#333' },
  username: { fontSize: 16, fontWeight: 'bold', color: 'darkslategrey' },
  logoutimg: { width: 25, height: 25 },
  separator: {
    borderBottomColor: 'rgb(0,0,0)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  topButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  topButton: { backgroundColor: '#007BFF', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5 },
  topButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  bankListContainer: { marginHorizontal: 20, marginTop: 20, maxHeight: 300 },
  bankItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  bankText: { fontSize: 16, color: '#333' },
  noAccountsText: { fontSize: 16, textAlign: 'center', marginTop: 20 },
  cardContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  balanceItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  bankName: { fontSize: 16, color: '#333', flex: 1 },
  bankBalance: { fontSize: 16, fontWeight: 'bold', color: '#333', flexShrink: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-around' },
  modalButton: { backgroundColor: '#007BFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
