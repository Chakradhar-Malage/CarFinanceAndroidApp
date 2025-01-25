import { useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const CompanyCard = () => {

    const navigation = useNavigation();

	return (
		<View style={styles.container}>
		{/* Card */}
            <TouchableOpacity onPress={() => navigation.navigate('HomeUIafterSignin')}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Welcome To !!
                        </Text>
                        <Text style={styles.subtitle}>
                            Om Sai Enterprises
                        </Text>
                    </View>
                    
                </View>
            </TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.navigate('BillingTypes')}>
				<View style={styles.card}>
					<View style={styles.header}>
						<Text style={styles.title}>
							Welcome To !!
						</Text>
						<Text style={styles.subtitle}>
							Billing Section
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
};



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

export default CompanyCard;
