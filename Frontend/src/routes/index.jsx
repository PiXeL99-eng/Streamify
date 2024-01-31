import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthRoute } from "./AuthRoute";
import { Home, Signin, Signup, Test, Stream, Consume} from "../pages"

const Routes = () => {

  const { userId, isLoaded } = useAuth()
  // Route configurations go here

  const routesForPublic = [
    {
      path: "/",
      element: <div>Landing</div>,
    },
    {
      path: "/stream",
      element: < Stream />,
    },
    {
      path: "/consume",
      element: < Consume />,
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
    {
      path: "/",
      element: <AuthRoute />,
      children: [
        {
          path: "/signin",
          element: <Signin />,
        },
        {
          path: "/signup",
          element: <Signup />,
        }
      ],
    }
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