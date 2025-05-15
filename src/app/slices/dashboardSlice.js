import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    adminSideMenu: false,
    supplierSideMenu: false,
}

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState, 
    reducers: {
        setAdminSideMenu: (state, action) => {
            state.adminSideMenu = action.payload;
            state.supplierSideMenu = false;
        },
        setSupplierSideMenu: (state, action) => {   
            state.supplierSideMenu = action.payload;
            state.adminSideMenu = false;
        },
    }   
})

export const { setAdminSideMenu, setSupplierSideMenu } = dashboardSlice.actions;
export default dashboardSlice.reducer;
