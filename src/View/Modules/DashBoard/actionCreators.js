import * as Actions from "./actions";
import axios from "axios";

export const setTasksFromBackEnd = (data) => {
    return async (dispatch) => {
        try {
            dispatch(Actions.setTasks(data));
        } catch (error) {
            console.log(`err from actionCreator ${err}`);
        }
    };
};

export const apiCallToUploadFile = (data) => {
    console.log(data);
    const baseUrl = "http://127.0.0.1:9000";
    axios
        .get(baseUrl)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    return async (dispatch) => {
        // axios
        //     .post("/api/upload-file", data)
        //     .then(function (response) {
        //         console.log(response);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    };
};
