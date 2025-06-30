"use client";

import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import { useParams, useRouter } from "next/navigation";
import { FiCheckCircle, FiPhone, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface OrderDetails {
  customerName: string;
  phoneNumber: string;
  tableId: string;
  orderTime: string;
}

export default function OrderSuccess() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId;
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // For now, we'll simulate it with localStorage
    const lastOrder = localStorage.getItem(`table_${tableId}_last_order`);
    if (lastOrder) {
      setOrderDetails(JSON.parse(lastOrder));
    }
  }, [tableId]);

  return (
    <div className="container mx-auto px-4 py-32">
      <Card className="max-w-2xl mx-auto">
        <CardBody className="text-center p-8">
          <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <Typography variant="h3" color="blue-gray" className="mb-4">
            Order Placed Successfully!
          </Typography>
          
          {orderDetails && (
            <div className="mb-6 text-left bg-blue-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="text-blue-gray-500" />
                <Typography color="blue-gray">
                  Name: {orderDetails.customerName}
                </Typography>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FiPhone className="text-blue-gray-500" />
                <Typography color="blue-gray">
                  Phone: {orderDetails.phoneNumber}
                </Typography>
              </div>
            </div>
          )}

          <Typography color="gray" className="mb-8">
            Your order has been received and will be prepared shortly.
            Please wait at Table {tableId}.
          </Typography>
          
          <Button
            color="blue"
            onClick={() => router.push(`/table/${tableId}`)}
          >
            Order More Items
          </Button>
        </CardBody>
      </Card>
    </div>
  );
} 