import { patientWithId } from "./patient"
import { User } from "./user"

export type rootState = {
    login: loginState,
    patient: patientState
}

export type loginState = {
    user: User
}

export type patientState = {
    patientList: patientWithId[],
    total: number,
    isDeletePopupOpen: boolean | string | null
}