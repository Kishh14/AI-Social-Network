import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:{token:"",details:""}
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        login_success:(state,action)=>{
            state.user.token = action.payload.token;
            state.user.details = action.payload.details;
        },
        logout_success:(state,action)=>{
            state.user.token = "";
            state.user.details = "";
        },
        update_username: (state, action) => {
            state.user.details.username = action.payload.username;
        },
        update_email: (state, action) => {
            state.user.details.email = action.payload.email;
        },
        update_bio: (state, action) => {
            state.user.details.bio = action.payload.bio;
        }
    }
})

export const {login_success,logout_success,update_username,update_email,update_bio} = userSlice.actions;
export default userSlice.reducer;