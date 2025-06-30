"use client";

import { Navbar, Footer } from "@/components";
import {
  Typography,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FiCheckCircle } from 'react-icons/fi';
import { useSession } from "next-auth/react";

interface OrderDetails {
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderTime: string;
  userEmail: string;
  phoneNumber: string;
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  img: string;
  description: string;
}

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.email) {
      router.push('/api/auth/signin');
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
      if (!cart.length) {
        router.push('/menu-page');
        return;
      }

      const total = cart.reduce((sum: number, item: CartItem) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const newOrder = {
        orderId: `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        items: cart,
        total: total,
        orderTime: new Date().toLocaleString(),
        userEmail: session.user.email,
        phoneNumber: localStorage.getItem('userPhone') || '',
      };

      // Save to order history
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.push(newOrder);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

      setOrderDetails(newOrder);
      localStorage.setItem('cart', '[]');

      // ✅ 1. Send phone number to backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/phone`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          phone: localStorage.getItem('userPhone') || '',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Phone number saved:', data);
        })
        .catch((err) => {
          console.error('Failed to save phone number:', err);
        });
    } catch (error) {
      console.error('Error processing order:', error);
      router.push('/menu-page');
    }
  }, [router, session]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <FiCheckCircle className="h-20 w-20 text-green-500" />
              </div>
              <Typography variant="h2" color="blue-gray" className="mb-4">
                Order Confirmed!
              </Typography>
              <Typography variant="lead" className="text-gray-600">
                Thank you for ordering at Paradise Cafe
              </Typography>
            </div>

            <Card className="mb-8">
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Order ID: {orderDetails.orderId}
                </Typography>
                
                <div className="bg-amber-50 p-6 rounded-lg mb-6 border border-amber-200">
                  <Typography className="text-amber-900 font-medium text-center">
                    Please proceed to the counter to make your payment.
                  </Typography>
                </div>

                <div className="mt-6 space-y-4">
                  <Link href="/order-history">
                    <Button color="blue" fullWidth>
                      View Order History
                    </Button>
                  </Link>
                  <Link href="/menu-page">
                    <Button color="blue" variant="outlined" fullWidth>
                      Order More
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      
    </>
  );
} 