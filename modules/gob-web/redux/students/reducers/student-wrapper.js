import {
    BEGIN_VALIDATE_SCHEDULES,
    VALIDATE_SCHEDULES,
    BEGIN_GET_STUDENT_DATA,
    GET_STUDENT_DATA,
    BEGIN_CHECK_GRADUATABILITY,
    CHECK_GRADUATABILITY,
    BEGIN_LOAD_STUDENT,
    LOAD_STUDENT,
} from '../constants'

import reducer from './student'

const initialState = {
    isChecking: false,
    isFetching: false,
    isLoading: false,
    isValdiating: false,
    data: {present: {}, past: [], future: []},
}

export default function studentWrapperReducer(state = initialState, action) {
    const {type, payload} = action

    switch (type) {
        case BEGIN_LOAD_STUDENT: {
            return {...state, isLoading: true}
        }
        case LOAD_STUDENT: {
            return {
                ...state,
                isLoading: false,
                data: reducer({...state.data, present: payload}, action),
            }
        }

        case BEGIN_GET_STUDENT_DATA: {
            return {...state, isFetching: true}
        }
        case GET_STUDENT_DATA: {
            return {
                ...state,
                data: reducer({...state.data, present: payload}, action),
                isFetching: false,
            }
        }

        case BEGIN_CHECK_GRADUATABILITY: {
            return {...state, isChecking: true}
        }
        case CHECK_GRADUATABILITY: {
            return {
                ...state,
                data: reducer({...state.data, present: payload}, action),
                isChecking: false,
            }
        }

        case BEGIN_VALIDATE_SCHEDULES: {
            return {...state, isValdiating: true}
        }
        case VALIDATE_SCHEDULES: {
            return {
                ...state,
                data: reducer({...state.data, present: payload}, action),
                isValdiating: false,
            }
        }

        default: {
            return {
                ...state,
                data: reducer(state.data, action),
            }
        }
    }
}
