"use client";

import { Navbar, Footer } from "@/components";
import { MenuItemCard } from "@/components/menu-item-card";
import { Typography, Button } from "@material-tailwind/react";
import Link from "next/link";
import { useState, useEffect } from "react";




interface CartItem {
  name: string;
  price: number;
  quantity: number;
  img: string;
  description: string;
}

export default function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [menuData, setMenuData] = useState<{ [category: string]: any[] }>({});
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/all`); // ✅ Adjust URL if deployed
        const data = await res.json();
  
        if (data.success) {
          // Group items by category
          const grouped: { [key: string]: any[] } = {};
          data.items.forEach((item: any) => {
            const cat = item.category || "others";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
          });
          setMenuData(grouped);
        } else {
          console.error("Failed to fetch menu:", data.error);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
  
    fetchMenu();
  }, []);
  

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setCartTotal(total);
  }, [cart]);

  const handleAddToCart = (item: any, quantity: number) => {
    // Ensure price is stored as a number
    const itemPrice = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^\d.]/g, ''))
      : item.price;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.name === item.name);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item with normalized price
        return [...prevCart, { 
          ...item, 
          price: itemPrice,  // Store price as number
          quantity 
        }];
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="pt-32 pb-20 px-8">
        <div className="container mx-auto">
          <Typography variant="h1" color="blue-gray" className="text-center mb-4">
            Our Menu
          </Typography>
          
          {/* Cart Summary */}
          <div className="flex justify-between items-center mb-8">
            <Typography variant="lead" className="text-gray-600">
              {cart.length > 0 ? `${cart.reduce((sum, item) => sum + item.quantity, 0)} items in cart` : 'Cart is empty'}
            </Typography>
            <div className="flex items-center gap-4">
              <Typography variant="h6" color="blue-gray">
                Total: ₹{cartTotal}
              </Typography>
              <Link href="/cart">
                <Button color="green" size="md">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>

          {/* Menu Sections */}
          {Object.entries(menuData).map(([section, items]) => (
            <div className="mb-12" key={section}>
              <Typography variant="h2" color="blue-gray" className="mb-8 border-b-2 border-gray-300 pb-2 capitalize">
                {section.replace(/_/g, " ")}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(items as any[]).map((item, index) => (
                  <MenuItemCard
                    key={index}
                    {...item}
                    price={`₹${item.price}`}  // Display price with ₹ symbol
                    onAddToCart={(quantity) => handleAddToCart(item, quantity)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
} 