import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, SafeAreaView, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from 'expo-router';
import { BackHandler } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Print from 'expo-print';
import XLSX from 'xlsx';

// Function to export data to Excel
const exportToExcel = (ledgerData) => {
  const ws = XLSX.utils.json_to_sheet(ledgerData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'LedgerData');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Create a file on device and save it
  const fileUri = FileSystem.documentDirectory + 'ledgerData.xlsx';
  FileSystem.writeAsStringAsync(fileUri, excelBuffer, { encoding: FileSystem.EncodingType.Base64 })
    .then(() => {
      Alert.alert("Excel File Created", "The Excel file has been successfully created.");
    })
    .catch((error) => {
      console.error(error);
    });
};

// Function to export data to PDF
const exportToPDF = (ledgerData) => {
  const htmlContent = `
    <html>
      <body>
        <h1>GST Billing Ledger</h1>
        <table border="1">
          <tr>
            <th>Date</th>
            <th>Invoice No</th>
            <th>Customer Name</th>
            <th>Contact No</th>
            <th>Company</th>
            <th>Payment Status</th>
            <th>Payment Method</th>
            <th>Total Amount</th>
            <th>Total Paid</th>
            <th>Due</th>
          </tr>
          ${ledgerData.map(item => `
            <tr>
              <td>${item.Date || '-'}</td>
              <td>${item.InvoiceNo || '-'}</td>
              <td>${item.CustomerName || '-'}</td>
              <td>${item.ContactNumber || '-'}</td>
              <td>${item.Company || 'Om Sai Enterprises'}</td>
              <td>${item.PaymentStatus || 'Due'}</td>
              <td>${item.PaymentMethod || 'None'}</td>
              <td>${item.TotalAmount || 0}</td>
              <td>${item.TotalPaid || 0}</td>
              <td>${item.Due || 0}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;

  Print.printAsync({ html: htmlContent })
    .then(() => {
      Alert.alert("PDF Exported", "Your PDF file has been exported successfully.");
    })
    .catch((error) => {
      console.error("Error exporting PDF:", error);
    });
};

// following code is perfect and does nothing after clicking on add payment
const GSTBillingLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openActions, setOpenActions] = useState(false);
  const [actionValue, setActionValue] = useState(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(null);

  const navigation = useNavigation();

  // Fetch customer names (runs only once on mount)
  const fetchCustomerNames = () => {
    axios.get('http://15.207.48.53:3000/customers')
      .then(response => {
        const customers = response.data.map(customer => ({
          label: customer.name,
          value: customer.name,
        }));
        setCustomerList(customers);
      })
      .catch(error => console.error('Error fetching customer names:', error));
  };

  // Fetch ledger data with filters
  const fetchLedgerData = () => {
    let query = `http://15.207.48.53:3000/gstbillingledger?`;

    if (customerName) query += `customer_name=${customerName}&`;
    if (startDate) query += `start_date=${startDate.toISOString().split('T')[0]}&`;
    if (endDate) query += `end_date=${endDate.toISOString().split('T')[0]}&`;
    if (paymentStatusFilter) query += `payment_status=${paymentStatusFilter}&`;

    axios.get(query)
      .then((response) => {
        // Only update state if the data has changed
        if (JSON.stringify(response.data) !== JSON.stringify(ledgerData)) {
          setLedgerData(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching ledger data:', error);
      });
  };

  // Handle action selection
  const handleActionSelect = (action) => {
    let newFilter = null;
    if (action === 'Due payments') {
      newFilter = 'Due';
    } else if (action === 'Partial payments') {
      newFilter = 'Partial';
    } else if (action === 'Paid') {
      newFilter = 'Paid';
    }

    // Only update state if there's a real change
    if (paymentStatusFilter !== newFilter) {
      setPaymentStatusFilter(newFilter);
    }
  };

  // Render ledger row
  const renderRow = ({ item }) => (
    <View style={[styles.row, { alignItems: 'stretch' }]}>
      <Text style={[styles.cell, { width: 112 }]}>{item.Date || '-'}</Text>
      <Text style={[styles.cell, { minWidth: 70, maxWidth: 70 }]}>{item.InvoiceNo || '-'}</Text>
      <Text style={[styles.cell, { minWidth: 180, maxWidth: 180, flexWrap: 'wrap', flex: 1 }]}>{item.CustomerName || '-'}</Text>
      <Text style={[styles.cell, { minWidth: 101, maxWidth: 120 }]}>{item.ContactNumber || '-'}</Text>
      <Text style={[styles.cell, { minWidth: 120, maxWidth: 151 }]}>{item.Company || 'Om Sai Enterprises'}</Text>
      <Text style={[styles.cell, { width: 119.5 }]}>{item.PaymentStatus || 'Due'}</Text>
      <Text style={[styles.cell, { width: 120.5 }]}>{item.PaymentMethod || 'None'}</Text>
      <Text style={[styles.cell, { minWidth: 120 }]}>{(item.TotalAmount || 0)}</Text>
      <Text style={[styles.cell, { minWidth: 120 }]}>{(item.TotalPaid || 0)}</Text>
      <Text style={[styles.cell, { minWidth: 120 }]}>{(item.Due || 0)}</Text>
    </View>
  );

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchCustomerNames();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image style={styles.usrimg} source={require("../assets/images/usericon.png")} />
          <View style={styles.userInfo}>
            <Text style={styles.helloname}>Hello,</Text>
            <Text style={styles.username}>OmSai</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.payment_exportButton} 
            onPress={() => navigation.navigate('Addpaymentpopup')}
          >
            <Text style={styles.buttonText}>Add Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.payment_exportButton}
            onPress={() => {
              Alert.alert(
                'Export Options',
                'Choose an export format',
                [
                  // { text: 'Export to Excel', onPress: () => exportToExcel(ledgerData) },
                  { text: 'Export to PDF', onPress: () => exportToPDF(ledgerData) },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          >
            <Text style={styles.buttonText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* Actions Dropdown */}
        <View style={styles.actionsContainer}>
          <DropDownPicker
            open={openActions}
            value={actionValue}
            items={[
              { label: 'Due Payments', value: 'Due payments' },
              { label: 'Partial Payments', value: 'Partial payments' },
              { label: 'Paid', value: 'Paid' },
            ]}
            setOpen={setOpenActions}
            setValue={setActionValue}
            placeholder="Payment Status"
            onChangeValue={(value) => {
              if (value) {
                handleActionSelect(value); // Only call handleActionSelect if value is not null
              }
            }}
            style={[styles.dropdown, { zIndex: openActions ? 1000 : 1 }]}
            dropDownContainerStyle={{ zIndex: 1000 }}
          />
        </View>

        {/* Filter Inputs */}
        <View style={styles.filterContainer}>
          {/* Dropdown for Customer Name with Search */}
          <DropDownPicker
            open={open}
            value={value}
            items={customerList.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setCustomerList}
            placeholder="Select Customer"
            searchable={true}
            searchPlaceholder="Search Customer"
            onChangeValue={(value) => setCustomerName(value)}
            style={[styles.dropdown, { zIndex: open ? 1000 : 1 }]}
            searchTextInputProps={{
              onChangeText: (text) => {
                setSearchQuery(text);
              },
              value: searchQuery,
            }}
          />

          {/* Date Pickers */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.buttonText}>Start Date</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.buttonText}>End Date</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}
          </View>

          <Button title="Search" onPress={fetchLedgerData} />
        </View>

        {/* Table */}
        <ScrollView horizontal>
          <View>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.headerCell, { fontWeight: 'bold', width: 143 }]}>Date</Text>
              <Text style={[styles.headerCell, { width: 70 }]}>Invoice No</Text>
              <Text style={[styles.headerCell, { width: 180 }]}>Customer Name</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Contact No</Text>
              <Text style={[styles.headerCell, { width: 151 }]}>Company</Text>
              <Text style={[styles.headerCell, { width: 151 }]}>Payment Status</Text>
              <Text style={[styles.headerCell, { width: 151 }]}>Payment Method</Text>
              <Text style={[styles.headerCell, { width: 151 }]}>Total Amount</Text>
              <Text style={[styles.headerCell, { width: 151 }]}>Total Paid</Text>
              <Text style={[styles.headerCell, { width: 151 }]}>Due</Text>
            </View>

            <FlatList
              data={ledgerData}
              renderItem={renderRow}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default GSTBillingLedger;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
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
  separator: {
    margin: 5,
    borderWidth: 1,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'stretch',
  },
  headerRow: {
    backgroundColor: '#d3d3d3',
  },
  cell: {
    padding: 10,
    paddingLeft: 2,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    borderLeftColor: '#ccc',
    borderLeftWidth: 1,
    flexWrap: 'wrap',
    flex: 1,
  },
  headerCell: {
    fontWeight: 'bold',
    padding: 10,
    paddingLeft: 2,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    flexWrap: 'wrap',
    flex: 1,
    color: '#000',
  },
  button: {
    backgroundColor: '#841584',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row', // Ensures buttons are in a single line
    justifyContent: 'space-between', // Adds space between buttons
    marginBottom: 10, // Adjust as needed
  },
  payment_exportButton: {
    backgroundColor: '#841584',
    paddingVertical: 12,
    paddingHorizontal: 20, // Adjusted for better spacing
    borderRadius: 10,
    flex: 1, // Ensures both buttons take equal width
    marginHorizontal: 5, // Adds spacing between buttons
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});