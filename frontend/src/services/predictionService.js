import api from "./api";

export const predictDisease = async (symptoms) => {

    try {

        const response = await api.post(
            "/disease/predict",
            {
                symptoms: symptoms
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Disease prediction error:",
            error
        );

        throw error;
    }
};