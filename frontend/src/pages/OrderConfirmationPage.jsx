import React, { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../lib/axios";

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  // const{ session_id } = useParams();
  const user = useUserStore((state) => state.user);
  const checkAuth = useUserStore((state) => state.checkAuth);
  const navigate = useNavigate();
  useEffect(() => {
    async function load() {
      try {
        console.log("Fetching order confirmation for session_id:", session_id);
        if (!session_id) {
          console.error("No session_id found in URL");
          navigate("/login");
          return;
        }
        if (session_id) {
            const res = await axiosInstance.get(`/api/orders/confirm?session_id=${session_id}`, {
              withCredentials: true
            });
          // const res = await fetch(`https://quickart-mern-deploy.onrender.com/api/orders/confirm?session_id=${session_id}`, {
          //   credentials: 'include'
          // });
          // if (!res.ok) {
          //   const errorText = await res.text();
          //   console.error("Server returned error:", res.status, errorText);
          //   navigate("/login");
          //   return;
          // }
          // if(res.status !== 200) {
          //   console.error("Failed to confirm order:", res.statusText);
          //   navigate("/login");
          //   return;
          // }
          // else if (res.status === 200) {
          //   console.log("Order confirmed successfully");  
          // }



          const data = await res.json();
          // const { user, order } = await res.json();
          if (!data || !data.user || !data.order) {
            console.error("Invalid response structure", data);
            navigate("/login");
            return;
          }
          console.log("User:", data.user);
          console.log("Order:", data.order);
          useUserStore.setState({ user: data.user });

          // ✅ Re-check auth to sync session and trigger dependent effects
          // await checkAuth();
          // set state with user and order (order.line_items.data)
          // useUserStore.setState({ user: data.user });

        }
      } catch (error) {
        console.error("Error fetching order confirmation:", error);
        navigate("/login");
      }
    }
    load();
  }, [session_id]);
  // useEffect(() => {
  //   console.log("User at confirm page:", user);
  //   if (!user) {
  //     console.log("No user found, redirecting to login...");
  //     navigate("/login");
  //   }
  // }, [user, navigate]);


  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-300">Loading user info…</p>
      </div>
    );
  }

  console.log("user", user);
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-green-500">
        Your order has been placed!
      </h1>
      <p className="text-gray-300 mt-4">
        Thank you for shopping with us, {user.name}.
      </p>
    </div>
  );
};

export default OrderConfirmationPage;
