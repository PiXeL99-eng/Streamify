import React, {useEffect} from 'react'
import { useAuth } from "@clerk/clerk-react"
import { Outlet, Navigate } from "react-router-dom"
import { userSetup } from '../api/userAPICalls'

export const ProtectedRoute = () => {

    const { userId, isLoaded } = useAuth()

    // console.log('test', userId)
    useEffect(() => {

        if (userId){

            // userSetup()
        }
    }, [userId])

    if (!isLoaded) return "Loading..."

    if (!userId) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/signin" />;
    }


    // If authenticated, render the child routes
    return <Outlet />
};