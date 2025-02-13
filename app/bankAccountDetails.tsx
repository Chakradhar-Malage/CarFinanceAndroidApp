// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   Alert,
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { useNavigation, useLocalSearchParams } from 'expo-router';
// import { globalState } from '@/src/globalState';

// const bankAccountDetails = () => {
//   const navigation = useNavigation();
//   // Retrieve the bankName passed as a parameter
//   const { bankName } = useLocalSearchParams();
//   const UserName = globalState.UserName;

//   // State for showing the transaction form modal and storing its data
//   const [showTransactionForm, setShowTransactionForm] = useState(false);
//   const [transactionType, setTransactionType] = useState(null); // 'credit' or 'debit'
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Options (for example, view transactions)
//   const options = [
//     { title: 'View Transactions', key: 'transactions' },
//   ];

//   const handleOptionPress = (optionKey) => {
//     console.log(`${optionKey} pressed for ${bankName}`);
//     if (optionKey === 'transactions') {
//       // Navigate to a transaction list page if it exists
//       navigation.navigate('TransactionsScreen', { bankName });
//     }
//   };

//   // When Credit or Debit is pressed, open the modal with the correct transaction type
//   const handleTransactionPress = (type) => {
//     setTransactionType(type);
//     setShowTransactionForm(true);
//   };

//   const handleCancelTransaction = () => {
//     setShowTransactionForm(false);
//     setAmount('');
//     setDescription('');
//     setTransactionType(null);
//   };

//   const handleSubmitTransaction = async () => {
//     // Basic validation
//     if (!amount || isNaN(amount)) {
//       Alert.alert('Validation Error', 'Please enter a valid amount');
//       return;
//     }

//     setIsSubmitting(true);

//     // Prepare the payload to send to the API
//     const payload = {
//       bankName, // Depending on your API, you may want to use an account id here.
//       transactionType,
//       amount: parseFloat(amount),
//       description,
//     };

//     try {
//       // Call your API endpoint – ensure you update the URL to your real endpoint.
//       const response = await fetch('http://192.168.1.209:3000/api/transactions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Transaction error: ', errorData);
//         Alert.alert('Error', errorData.message || 'Something went wrong');
//         setIsSubmitting(false);
//         return;
//       }

//       const data = await response.json();
//       console.log('Transaction successful: ', data);
//       Alert.alert('Success', 'Transaction processed successfully');

//       // Optionally, update your local state with new balance information here.
//       // e.g., re-fetch account details or update a local balance state variable.

//       // Reset form and close modal
//       setShowTransactionForm(false);
//       setAmount('');
//       setDescription('');
//       setTransactionType(null);
//     } catch (error) {
//       console.error('API Error:', error);
//       Alert.alert('Error', 'Unable to process transaction at this time.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <SafeAreaView>
//         {/* Header Section */}
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

//         {/* Selected Bank/Cash Title */}
//         <View style={styles.selectedBankContainer}>
//           <Text style={styles.selectedBankText}>
//             {bankName} Account Details
//           </Text>
//         </View>

//         {/* Options List */}
//         <View style={styles.optionsContainer}>
//           {options.map((option) => (
//             <TouchableOpacity
//               key={option.key}
//               style={styles.optionButton}
//               onPress={() => handleOptionPress(option.key)}
//             >
//               <Text style={styles.optionText}>{option.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Credit and Debit Buttons in a Single Row */}
//         <View style={styles.transactionRow}>
//           <TouchableOpacity
//             style={styles.transactionButton}
//             onPress={() => handleTransactionPress('credit')}
//           >
//             <Text style={styles.transactionButtonText}>Credit</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.transactionButton}
//             onPress={() => handleTransactionPress('debit')}
//           >
//             <Text style={styles.transactionButtonText}>Debit</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Transaction Form Modal */}
//         <Modal
//           visible={showTransactionForm}
//           transparent={true}
//           animationType="slide"
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <Text style={styles.modalTitle}>
//                 {transactionType === 'credit'
//                   ? 'Credit Transaction'
//                   : 'Debit Transaction'}
//               </Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter amount"
//                 keyboardType="numeric"
//                 value={amount}
//                 onChangeText={setAmount}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder={
//                   transactionType === 'credit'
//                     ? 'Description of credit:'
//                     : 'Reason for debit?'
//                 }
//                 value={description}
//                 onChangeText={setDescription}
//               />
//               <View style={styles.modalButtonRow}>
//                 <TouchableOpacity
//                   style={styles.modalButton}
//                   onPress={handleCancelTransaction}
//                   disabled={isSubmitting}
//                 >
//                   <Text style={styles.modalButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.modalButton}
//                   onPress={handleSubmitTransaction}
//                   disabled={isSubmitting}
//                 >
//                   <Text style={styles.modalButtonText}>
//                     {isSubmitting ? 'Submitting...' : 'Submit'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// export default bankAccountDetails;

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
//   selectedBankContainer: {
//     marginHorizontal: 20,
//     marginTop: 10,
//     padding: 15,
//     borderRadius: 5,
//     backgroundColor: '#f0f0f0',
//     alignItems: 'center',
//   },
//   selectedBankText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   optionsContainer: {
//     marginHorizontal: 20,
//     marginTop: 20,
//   },
//   optionButton: {
//     backgroundColor: '#841584',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginBottom: 15,
//     alignItems: 'center',
//   },
//   optionText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   transactionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: 20,
//     marginTop: 20,
//   },
//   transactionButton: {
//     backgroundColor: '#841584',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     flex: 0.45,
//     alignItems: 'center',
//   },
//   transactionButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   modalButtonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   modalButton: {
//     backgroundColor: '#841584',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });


import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert 
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { globalState } from '@/src/globalState';

const bankAccountDetails = () => {
  const navigation = useNavigation();
  const { bankName } = useLocalSearchParams();
  const UserName = globalState.UserName;

  // State to hold account details (fetched from API)
  const [account, setAccount] = useState(null);

  // States for transaction form
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState(null); // 'credit' or 'debit'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options for view transactions
  const options = [
    { title: 'View Transactions', key: 'transactions' },
  ];

  // Function to fetch all accounts, then filter for the current account by bankName
  const fetchAccountData = async () => {
    try {
      const response = await fetch('http://15.207.48.53:3000/api/accounts');
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching accounts:', errorData.message);
        return;
      }
      const data = await response.json();
      // Find the account that matches the bankName
      const found = data.accounts.find(acc => acc.name === bankName);
      if (found) {
        setAccount(found);
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  // Fetch account data when the component mounts or when bankName changes
  useEffect(() => {
    fetchAccountData();
  }, [bankName]);

  // Handler for view transactions option
  const handleOptionPress = (optionKey) => {
    if (optionKey === 'transactions') {
      navigation.navigate('TransactionsScreen', { bankName });
    }
  };

  // When Credit or Debit is pressed, open the modal with the correct transaction type
  const handleTransactionPress = (type) => {
    setTransactionType(type);
    setShowTransactionForm(true);
  };

  const handleCancelTransaction = () => {
    setShowTransactionForm(false);
    setAmount('');
    setDescription('');
    setTransactionType(null);
  };

  // Submit a transaction and refresh account data afterward
  const handleSubmitTransaction = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return;
    }
    setIsSubmitting(true);

    const payload = {
      bankName,
      transactionType,
      amount: parseFloat(amount),
      description,
    };

    try {
      const response = await fetch('http://15.207.48.53:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Something went wrong');
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      console.log('Transaction successful:', data);
      Alert.alert('Success', 'Transaction processed successfully');

      // Reset form and close modal
      setShowTransactionForm(false);
      setAmount('');
      setDescription('');
      setTransactionType(null);
      // Refresh account details to display updated current balance
      fetchAccountData();
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Unable to process transaction at this time.');
    } finally {
      setIsSubmitting(false);
    }
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
        
        {/* Selected Bank/Cash Title and Balance */}
        <View style={styles.selectedBankContainer}>
          <Text style={styles.selectedBankText}>{bankName} Account Details</Text>
          {account && (
            <Text style={styles.balanceText}>Current Balance: Rs. {account.current_balance}</Text>
          )}
        </View>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity key={option.key} style={styles.optionButton} onPress={() => handleOptionPress(option.key)}>
              <Text style={styles.optionText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Credit and Debit Buttons */}
        <View style={styles.transactionRow}>
          <TouchableOpacity style={styles.transactionButton} onPress={() => handleTransactionPress('credit')}>
            <Text style={styles.transactionButtonText}>Credit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.transactionButton} onPress={() => handleTransactionPress('debit')}>
            <Text style={styles.transactionButtonText}>Debit</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Form Modal */}
        <Modal visible={showTransactionForm} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {transactionType === 'credit' ? 'Credit Transaction' : 'Debit Transaction'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <TextInput
                style={styles.input}
                placeholder={transactionType === 'credit' ? 'Description of credit:' : 'Reason for debit?'}
                value={description}
                onChangeText={setDescription}
              />
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.modalButton} onPress={handleCancelTransaction} disabled={isSubmitting}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleSubmitTransaction} disabled={isSubmitting}>
                  <Text style={styles.modalButtonText}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default bankAccountDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  usrimg: { width: 50, height: 50, borderRadius: 25 },
  userInfo: { marginLeft: 10, flex: 1 },
  helloname: { fontSize: 14, color: '#333' },
  username: { fontSize: 16, fontWeight: 'bold', color: 'darkslategrey' },
  logoutimg: { width: 25, height: 25 },
  separator: { borderBottomColor: 'rgb(0,0,0)', borderBottomWidth: StyleSheet.hairlineWidth, marginHorizontal: 20, marginVertical: 10 },
  selectedBankContainer: { marginHorizontal: 20, marginTop: 10, padding: 15, borderRadius: 5, backgroundColor: '#f0f0f0', alignItems: 'center' },
  selectedBankText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  balanceText: { fontSize: 16, marginTop: 5, color: 'green' },
  optionsContainer: { marginHorizontal: 20, marginTop: 20 },
  optionButton: { backgroundColor: '#841584', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 5, marginBottom: 15, alignItems: 'center' },
  optionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  transactionRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginTop: 20 },
  transactionButton: { backgroundColor: '#841584', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  transactionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-around' },
  modalButton: { backgroundColor: '#841584', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
