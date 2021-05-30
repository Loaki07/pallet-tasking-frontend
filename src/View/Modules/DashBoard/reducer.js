import { GET_TASKS } from "./constants";

const initialState = {
    tasks: [],
};

export const dashBoardReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TASKS:
            console.log(`action.payload ${action.payload}`);
            return {
                ...state,
                tasks: action.payload,
            };
        default:
            return state;
    }
};
