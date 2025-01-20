
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default values for the global state
export const globalState = {
    TempforViewing: null,
    totalPendingAmount: 0,
    UserName: 'OmSai',
    totalCount: 0,
};

// Function to load saved data from AsyncStorage
export const loadGlobalState = async () => {
    try {
        const totalPendingAmount = await AsyncStorage.getItem('totalPendingAmount');
        const totalCount = await AsyncStorage.getItem('totalCount');
        
        // Update globalState with persisted values
        if (totalPendingAmount !== null) globalState.totalPendingAmount = Number(totalPendingAmount);
        if (totalCount !== null) globalState.totalCount = Number(totalCount);
    } catch (error) {
        console.error('Error loading global state:', error);
    }
};

// Function to save global state to AsyncStorage
export const saveGlobalState = async () => {
    try {
        await AsyncStorage.setItem('totalPendingAmount', String(globalState.totalPendingAmount));
        await AsyncStorage.setItem('totalCount', String(globalState.totalCount));
    } catch (error) {
        console.error('Error saving global state:', error);
    }
};
