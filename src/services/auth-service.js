import axios from "axios";
import * as constants from "./constants";

const register = (fullName, email, password) => {
    return axios.post(constants.registerUrl, {
        fullName,
        email,
        password,
    });
};

const login = (username, password) => {
    return axios.post(constants.loginUrl, {
        username,
        password,
    }).then((response) => {
        if (response.data.responseData) {
            // save data
        }
        return response.data.responseData;
    });
};

const logout = () => {
    // remove data
};

const getCurrentUser = () => {
    // get data
};

const getAuthHeader = () => {
    //get data

    if (user && user.accessToken) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
}

export default {
    register,
    login,
    logout,
    getCurrentUser,
    getAuthHeader
};