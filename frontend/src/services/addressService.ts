import api from './api';

export interface Address {
    _id?: string;
    name: string;
    mobileNum: string;
    address: string;
    pincode: string;
}

export const addressService = {
    // Get all addresses
    getAddresses: async () => {
        const response = await api.get('/address/fetchAddress');
        return response.data;
    },

    // Add new address
    addAddress: async (addressData: Address) => {
        const response = await api.post('/address/addAddress', addressData);
        return response.data;
    },

    // Delete address
    deleteAddress: async (id: string) => {
        const response = await api.delete(`/address/deleteAddress/${id}`);
        return response.data;
    }
};
