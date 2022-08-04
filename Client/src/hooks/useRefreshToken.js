import axios from "../api/axios";
import { useContext } from "react";
import UserContext from "../context/userProvider";

const useRefreshToken = () => {

    const { setUser } = useContext(UserContext);

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setUser(prev => {
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;