import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const BillingTypeCard = () => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
        {/* Card */}
            <TouchableOpacity onPress={() => navigation.navigate('ViewInvoices')}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        {/* <Text style={styles.title}>
                            Welcome To !!
                        </Text> */}
                        <Text style={styles.subtitle}>
                            Om Sai Enterprise
                        </Text>
                    </View>
                    
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ViewNonGSTInvoices')}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        {/* <Text style={styles.title}>
                            Welcome To !!
                        </Text> */}
                        <Text style={styles.subtitle}>
                            Om Sai Generators
                        </Text>
                    </View>
                    
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('quotation')}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.subtitle}>
                            Enterprise Quotations
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Generatorquotation')}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.subtitle}>
                            Generator Quotations
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};


export default BillingTypeCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 16,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 14,
        width: 350,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    header: {
        marginBottom: 16,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'rgb(4, 101, 54)',
    },
    title: {
        fontSize: 24,
        color: '#333',
        marginTop: 10,
    },
    content: {
        alignItems: 'center',
    },
    text: {
        fontSize: 17,
        color: '#444444',
        textAlign: 'center',
    },
});

