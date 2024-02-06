import React, {useState} from 'react'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"
import { ProtectedRoute } from "./ProtectedRoute";
import { Home, Test, Stream, Consume, VideoPage, AllVideos, Landing} from "../pages"

const Routes = () => {

  const { userId, isLoaded } = useAuth()
  const [profile, setProfile] = useState("viewer") // or streamer

  // Route configurations go here

  const routesForPublic = [
    {
      path: "/",
      element: < Landing />,
    },
    {
      path: "/stream",
      element: < Stream />,
    },
    {
      path: "/consume",
      element: < Consume />,
    },
    {
      path: "/videopage",
      element: < VideoPage profile = {profile} setProfile = {setProfile}/>,
    },
    {
      path: "/allvideos",
      element: < AllVideos profile = {profile} setProfile = {setProfile}/>,
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/home",
          element: <Home />,
        }
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    // {
    //   path: "/",
    //   element: <AuthRoute />,
    //   children: [
    //     {
    //       path: "/signin",
    //       element: <Signin />,
    //     },
    //     {
    //       path: "/signup",
    //       element: <Signup />,
    //     }
    //   ],
    // }
  ];


  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...routesForNotAuthenticatedOnly,
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;