import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../features/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Public pages
      {
        index: true,
        lazy: async () => {
          const { default: Component } =
            await import("../features/home/HomePage");
          return { Component };
        },
      },
      {
        path: "bible",
        lazy: async () => {
          const { default: Component } =
            await import("../features/bible/BiblePage");
          return { Component };
        },
      },
      {
        path: "compare",
        lazy: async () => {
          const { default: Component } =
            await import("../features/comparison/ComparisonPage");
          return { Component };
        },
      },

      // Pages requiring authentication
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "editorial",
            lazy: async () => {
              const { default: Component } =
                await import("../features/editorial/EditorialPage");
              return { Component };
            },
          },
          {
            path: "profile",
            lazy: async () => {
              const { default: Component } =
                await import("../features/auth/ProfilePage");
              return { Component };
            },
          },
          {
            path: "profile/edit",
            lazy: async () => {
              const { default: Component } =
                await import("../features/auth/EditProfilePage");
              return { Component };
            },
          },
          {
            path: "teacher",
            lazy: async () => {
              const { default: Component } =
                await import("../features/teacher/TeacherDemoPage");
              return { Component };
            },
          },
          {
            path: "sunday-school",
            lazy: async () => {
              const { default: Component } =
                await import("../features/sunday-school/SundaySchoolPage");
              return { Component };
            },
          },
          {
            path: "sunday-school/lessons/:lessonId",
            lazy: async () => {
              const { default: Component } =
                await import("../features/sunday-school/SundaySchoolLessonPage");
              return { Component };
            },
          },
        ],
      },

      // Authentication pages
      {
        path: "auth/register",
        lazy: async () => {
          const { RegisterPage: Component } =
            await import("../features/auth/AuthPages");
          return { Component };
        },
      },
      {
        path: "auth/login",
        lazy: async () => {
          const { LoginPage: Component } =
            await import("../features/auth/AuthPages");
          return { Component };
        },
      },
      {
        path: "auth/forgot-password",
        lazy: async () => {
          const { ForgotPasswordPage: Component } =
            await import("../features/auth/AuthPages");
          return { Component };
        },
      },
      {
        path: "auth/reset-password",
        lazy: async () => {
          const { SetNewPasswordPage: Component } =
            await import("../features/auth/AuthPages");
          return { Component };
        },
      },
      {
        path: "auth/callback",
        lazy: async () => {
          const { AuthCallbackPage: Component } =
            await import("../features/auth/AuthPages");
          return { Component };
        },
      },

      // Unknown routes
      {
        path: "*",
        lazy: async () => {
          const { default: Component } = await import("./NotFoundPage");
          return { Component };
        },
      },
    ],
  },
]);

export default router;
