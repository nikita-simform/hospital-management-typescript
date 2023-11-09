import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "../../../node_modules/@reduxjs/toolkit/dist/createAction";
import { patientWithId } from "../../types/patient";
import { patientState } from "../../types/storeTypes";

const initialState = {
  patientList: [],
  total:0,
  isDeletePopupOpen:null
};

export const PatientSlice = createSlice({
  name: "Patient",
  initialState,
  reducers: {
    setPatientList: (state:patientState, action:PayloadAction< patientWithId[]>) => {
      state.patientList = action.payload;
    },
    setTotalPatients:(state:patientState,action:PayloadAction<number>)=>{
      state.total=action.payload;
    },
    setIsDeletePopupOpen:(state:patientState,action:PayloadAction<boolean>)=>{
      state.isDeletePopupOpen=action.payload;
    }
  },
});

export const {setPatientList,setTotalPatients,setIsDeletePopupOpen} = PatientSlice.actions;

export default PatientSlice.reducer;
