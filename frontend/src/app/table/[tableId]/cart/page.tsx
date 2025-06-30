"use client";

import {
  Typography,
  Button,
  Card,
  CardBody,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiPhone, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSession } from "next-auth/react";

const VALID_TABLES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function TableCart() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    // Validate table number
    if (!VALID_TABLES.includes(tableId)) {
      toast.error('Invalid table number');
      router.push('/');
      return;
    }

    const savedCart = localStorage.getItem(`table_${tableId}_cart`);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      calculateTotal(parsedCart);
    }
  }, [tableId, router]);

  const calculateTotal = (cartItems: any[]) => {
    const sum = cartItems.reduce((total, item) => {
      // Handle both string and number price types
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
        : item.price;
      return total + (price * item.quantity);
    }, 0);
    setTotal(sum);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
    localStorage.setItem(`table_${tableId}_cart`, JSON.stringify(newCart));
    calculateTotal(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem(`table_${tableId}_cart`, JSON.stringify(newCart));
    calculateTotal(newCart);
  };

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!number) {
      return "Phone number is required";
    }
    if (!phoneRegex.test(number)) {
      return "Please enter a valid 10-digit Indian phone number";
    }
    return "";
  };

  const validateName = (name: string) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    return "";
  };

  const handlePlaceOrder = async () => {
    // Validate name
    const nameValidationError = validateName(customerName);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    // Validate phone number
    const phoneValidationError = validatePhoneNumber(phoneNumber);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    // Create optimized order object with minimal data
    const order = {
      tableId,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      userEmail: session?.user?.email || "", 
      items: cart.map(item => ({
        name: item.name,
        price: typeof item.price === 'string' 
          ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
          : item.price,
        quantity: item.quantity
      })),
      total,
      orderTime: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Order placed successfully!');
        localStorage.removeItem(`table_${tableId}_cart`);
        setShowConfirmDialog(false);
        router.push(`/table/${tableId}/order-success`);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-32">
      <Typography variant="h2" color="blue-gray" className="mb-8">
        Your Order - Table {tableId}
      </Typography>

      {cart.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Your cart is empty
            </Typography>
            <Button
              color="blue"
              onClick={() => router.push(`/table/${tableId}`)}
            >
              View Menu
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item, index) => (
              <Card key={index} className="mb-4">
                <CardBody className="flex items-center gap-4">
                  <div className="flex-grow">
                    <Typography variant="h6" color="blue-gray">
                      {item.name}
                    </Typography>
                    <Typography color="gray">
                      {item.price} x {item.quantity}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                    >
                      <FiMinus />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                    >
                      <FiPlus />
                    </IconButton>
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={() => removeItem(index)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-4">
                Order Summary
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Typography color="gray">Subtotal</Typography>
                  <Typography>₹{total}</Typography>
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex justify-between">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="blue">
                    ₹{total}
                  </Typography>
                </div>
              </div>
              <Button
                color="blue"
                fullWidth
                className="mt-6"
                onClick={() => setShowConfirmDialog(true)}
              >
                Place Order
              </Button>
            </CardBody>
          </Card>
        </div>
      )}

      <Dialog open={showConfirmDialog} handler={() => setShowConfirmDialog(false)}>
        <DialogHeader>Complete Your Order</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div>
              <Input
                label="Your Name"
                icon={<FiUser />}
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setNameError("");
                }}
                error={!!nameError}
              />
              {nameError && (
                <Typography color="red" className="text-xs mt-1">
                  {nameError}
                </Typography>
              )}
            </div>

            <div>
              <Input
                type="tel"
                label="Phone Number"
                icon={<FiPhone />}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneError("");
                }}
                error={!!phoneError}
              />
              {phoneError && (
                <Typography color="red" className="text-xs mt-1">
                  {phoneError}
                </Typography>
              )}
            </div>

            <Typography color="gray" className="text-sm">
              Please provide your details for order confirmation
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowConfirmDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button color="blue" onClick={handlePlaceOrder}>
            Confirm Order
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
} 