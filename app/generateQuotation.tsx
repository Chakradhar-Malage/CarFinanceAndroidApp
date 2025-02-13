import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { TextInput, Button, Card, IconButton } from 'react-native-paper';
import axios from 'axios';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const generateQuotation = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    mobile: '',
    address: '',
    gstin: '',
    termsConditions: '', // Added for storing Terms & Conditions
  });
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  

  useEffect(() => {
    axios
      .get('http://15.207.48.53:3000/quotation-customers')
      .then(response => {
        setCustomersList(response.data);
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const handleCustomerChange = (key, value) => {
    setCustomerDetails({ ...customerDetails, [key]: value });
  };

  const handleExistingCustomerSearch = () => {
    const matchedCustomer = customersList.find(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobile.includes(searchQuery)
    );
  
    if (matchedCustomer) {
      setSelectedCustomer(matchedCustomer);
  
      // Update customerDetails with all relevant fields, including gstin
      setCustomerDetails({
        name: matchedCustomer.name,
        mobile: matchedCustomer.mobile,
        address: matchedCustomer.address,
        gstin: matchedCustomer.gstin,  // Make sure gstin is included here
        termsConditions: matchedCustomer.terms_conditions || '', // Optional field
      });
    } else {
      Alert.alert('Not Found', 'No customer matches your search.');
    }
  };
  

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: '', rate: '' }]);
  };

  const deleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const generateInvoice = async () => {
    try {
      const response = await axios.post('http://15.207.48.53:3000/generate-quotation', {
        customerName: customerDetails.name,
        customerMobile: customerDetails.mobile,
        customerAddress: customerDetails.address,
        customerGstin: customerDetails.gstin,
        termsConditions: customerDetails.termsConditions  || "N/A", // Send Terms & Conditions in the request
        products: products.map((product) => ({
          name: product.name,
          quantity: parseInt(product.quantity),
          rate: parseInt(product.rate),
        })),
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Invoice generated successfully!');
      }
    } catch (error) {
      console.error('Error generating invoice:', error.response || error);
      Alert.alert('Error', 'Failed to generate invoice.');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.buttonSection}>
          <Button mode="contained" onPress={() => setIsNewCustomer(true)} style={styles.button}>
            New Customer
          </Button>
          <Button mode="contained" onPress={() => setIsNewCustomer(false)} style={styles.button}>
            Existing Customer
          </Button>
        </View>

        {isNewCustomer ? (
          <Card style={styles.card}>
            <Card.Title title="New Customer Details" />
            <Card.Content>
              {['name', 'mobile', 'address', 'gstin'].map((field, index) => (
                <TextInput
                  key={index}
                  label={`Customer ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                  value={customerDetails[field]}
                  onChangeText={(text) => handleCustomerChange(field, text)}
                  style={styles.input}
                  mode="outlined"
                  keyboardType={field==='mobile' ? 'numeric' : 'none' }
                  autoCapitalize={field === 'gstin' ? 'characters' : 'none'} // Auto capitalize only for gstin
                />
              ))}
              
              {/* Add Terms & Conditions Input */}
              <TextInput
                label="Terms & Conditions"
                value={customerDetails.termsConditions}
                onChangeText={(text) => handleCustomerChange('termsConditions', text)}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
              />
            </Card.Content>
          </Card>
        ) : (
          <>
            <Card style={styles.card}>
              <Card.Title title="Search Existing Customer" />
              <Card.Content>
                <TextInput
                  label="Search Customer"
                  placeholder="Search by name or mobile"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.input}
                  mode="outlined"
                />
                <Button mode="outlined" onPress={handleExistingCustomerSearch} style={styles.searchButton}>
                  Search
                </Button>
              </Card.Content>
            </Card>

            {selectedCustomer && (
              <Card style={styles.card}>
                <Card.Title title="Customer Details" />
                <Card.Content>
                {['name', 'mobile', 'address', 'gstin', 'termsConditions'].map((field, index) => (
                  <TextInput
                    key={index}
                    label={`Customer ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                    value={customerDetails[field]}
                    onChangeText={(text) => handleCustomerChange(field, text)}
                    style={styles.input}
                    mode="outlined"
                    multiline={field === 'termsConditions'} // Allow multiline for termsConditions
                    numberOfLines={field === 'termsConditions' ? 4 : 1}
                  />
                ))}
                </Card.Content>
              </Card>
            )}
          </>
        )}

        <Card style={styles.card}>
          <Card.Title title="Products" />
          <Card.Content>
            {products.map((product, index) => (
              <Card key={index} style={styles.productCard}>
                <Card.Title title={`Product ${index + 1}`} />
                <Card.Content>
                  <TextInput
                    label="Product Name"
                    value={product.name}
                    onChangeText={(text) => {
                      const updatedProducts = [...products];
                      updatedProducts[index].name = text;
                      setProducts(updatedProducts);
                    }}
                    style={styles.input}
                    mode="outlined"
                  />
                  <TextInput
                    label="Quantity"
                    value={product.quantity}
                    onChangeText={(text) => {
                      const updatedProducts = [...products];
                      updatedProducts[index].quantity = text;
                      setProducts(updatedProducts);
                    }}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="numeric"
                  />
                  <TextInput
                    label="Rate"
                    value={product.rate}
                    onChangeText={(text) => {
                      const updatedProducts = [...products];
                      updatedProducts[index].rate = text;
                      setProducts(updatedProducts);
                    }}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="numeric"
                  />
                </Card.Content>
                <Card.Actions style={styles.productActions}>
                  <Button mode="outlined" onPress={() => deleteProduct(index)} color="red">
                    Delete
                  </Button>
                </Card.Actions>
              </Card>
            ))}
            <Button mode="outlined" onPress={addProduct} style={styles.addProductButton}>
              Add Product
            </Button>
          </Card.Content>
        </Card>

        <Button mode="contained" onPress={generateInvoice} style={styles.generateButton}>
          Generate Quotation
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  buttonSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  button: { flex: 1, marginHorizontal: 5 },
  card: { marginBottom: 20 },
  input: { marginBottom: 10 },
  searchButton: { marginTop: 10 },
  productContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  deleteButton: { marginLeft: 10 },
  generateButton: { marginTop: 20, backgroundColor: '#841584' },
});

export default generateQuotation;
