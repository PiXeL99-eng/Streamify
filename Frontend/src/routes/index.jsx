import React, { useState, useEffect } from 'react'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import { useAuth } from "@clerk/clerk-react"
import { ProtectedRoute } from "./ProtectedRoute";
import { Test, VideoPage, AllVideos, Landing, PastStreams } from "../pages"


const Routes = () => {

  const [profile, setProfile] = useState("viewer") // or streamer
  const [viewVideoDetails, setViewVideoDetails] = useState({})

  // Route configurations go here

  const routesForPublic = [
    {
      path: "/",
      element: < Landing />,
    }
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/videopage",
          element: < VideoPage profile={profile} setProfile={setProfile} viewVideoDetails={viewVideoDetails} setViewVideoDetails={setViewVideoDetails} />,
        },
        {
          path: "/allvideos/:query",
          element: < AllVideos profile={profile} setProfile={setProfile} setViewVideoDetails={setViewVideoDetails} />,
        },
        {
          path: "/allvideos",
          element: < AllVideos profile={profile} setProfile={setProfile} setViewVideoDetails={setViewVideoDetails} />,
        },
        {
          path: "/paststreams",
          element: < PastStreams profile={profile} setProfile={setProfile} setViewVideoDetails={setViewVideoDetails} />,
        },
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