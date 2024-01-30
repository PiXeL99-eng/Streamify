import React from 'react'
import { useAuth } from "@clerk/clerk-react"
import { Outlet, Navigate } from "react-router-dom"

export const AuthRoute = () => {

    const { userId, isLoaded } = useAuth()

    console.log('test', userId)

    if (!isLoaded) return "Loading..."

    if (userId) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/home" />;
    }

    // If authenticated, render the child routes
    return <Outlet />
};