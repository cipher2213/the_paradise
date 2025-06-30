"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
  Input,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { FiEdit2, FiTrash2, FiPlus, FiUpload } from "react-icons/fi";
import Image from "next/image";
import toast from "react-hot-toast";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  img: string;
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    img: "",
  });

  const categories = [
    "starters",
    "main_course",
    "desserts",
    "beverages",
    "snacks",
    "others",
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/all`);
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.items);
      } else {
        toast.error("Failed to fetch menu items");
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      toast.error("Error loading menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage =async (
    file: File,
    name: string,
    description: string,
    price: number,
    category: string
  ): Promise<any> =>  {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("image", file); 

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/add`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item added successfully");
        setShowAddDialog(false);
        fetchMenuItems();
        setFormData({ name: "", description: "", price: "", category: "", img: "" });
        setSelectedImage(null);
        setImagePreview("");
        return data;
      } else {
        toast.error(data.message || "Failed to add menu item");
        return null;
      }
    } catch (err) {
      console.error("Error adding menu item:", err);
      toast.error("Error adding menu item");
      return null;
    }
  };

  const handleAddItem = async () => {
    try {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        toast.error("Please enter a valid price");
        return;
      }

      if (!selectedImage) {
        toast.error("Please select an image");
        return;
      }

      // Upload image first
      const uploadResponse = await uploadImage(
        selectedImage,
        formData.name,
        formData.description,
        price,
        formData.category
      );
      // If uploadResponse contains the image URL, use it. Otherwise, fallback to formData.img
      const imageUrl = uploadResponse?.imageUrl || uploadResponse?.img || formData.img;
      if (!imageUrl) {
        toast.error("Failed to get uploaded image URL");
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price,
          img: imageUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item added successfully");
        setShowAddDialog(false);
        fetchMenuItems();
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          img: "",
        });
        setSelectedImage(null);
        setImagePreview("");
      } else {
        toast.error(data.message || "Failed to add menu item");
      }
    } catch (err) {
      console.error("Error adding menu item:", err);
      toast.error("Error adding menu item");
    }
  };

  const handleEditItem = async () => {
    if (!selectedItem) return;

    try {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        toast.error("Please enter a valid price");
        return;
      }

      const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("description", formData.description);
    updateData.append("price", price.toString());
    updateData.append("category", formData.category);
    if (selectedImage) {
      updateData.append("image", selectedImage);
    }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/update/${selectedItem._id}`, {
        method: "PUT",
        body: updateData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item updated successfully");
        setShowEditDialog(false);
        fetchMenuItems();
        setSelectedImage(null);
        setImagePreview("");
      } else {
        toast.error(data.message || "Failed to update menu item");
      }
    } catch (err) {
      console.error("Error updating menu item:", err);
      toast.error("Error updating menu item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item deleted successfully");
        fetchMenuItems();
      } else {
        toast.error(data.message || "Failed to delete menu item");
      }
    } catch (err) {
      console.error("Error deleting menu item:", err);
      toast.error("Error deleting menu item");
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      img: item.img,
    });
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" color="blue-gray">
          Menu Management
        </Typography>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <FiPlus className="h-4 w-4" /> Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item._id} className="overflow-hidden">
            <CardHeader floated={false} className="h-48 relative">
              <Image
                src={item.img}
                alt={item.name}
                fill
                className="object-cover"
              />
            </CardHeader>
            <CardBody>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Typography variant="h5" color="blue-gray">
                    {item.name}
                  </Typography>
                  <Typography color="gray" className="text-sm capitalize">
                    {item.category.replace(/_/g, " ")}
                  </Typography>
                </div>
                <Typography variant="h6" color="blue-gray">
                  ₹{item.price}
                </Typography>
              </div>
              <Typography color="gray" className="mb-4">
                {item.description}
              </Typography>
              <div className="flex justify-end gap-2">
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={() => openEditDialog(item)}
                >
                  <FiEdit2 className="h-4 w-4" />
                </IconButton>
                <IconButton
                  variant="text"
                  color="red"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  <FiTrash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog || showEditDialog} handler={() => (showAddDialog ? setShowAddDialog(false) : setShowEditDialog(false))} size="md">
        <DialogHeader>{showAddDialog ? "Add New Menu Item" : "Edit Menu Item"}</DialogHeader>
        <DialogBody divider className="overflow-y-auto max-h-[600px]">
          <div className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value || "" })}
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category.replace(/_/g, " ")}
                </Option>
              ))}
            </Select>
            
            {/* Image Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              {imagePreview && (
                <div className="relative w-full h-48 mt-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              if (showAddDialog) {
                setShowAddDialog(false);
              } else {
                setShowEditDialog(false);
              }
              setSelectedImage(null);
              setImagePreview("");
            }}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            color={showAddDialog ? "green" : "blue"}
            onClick={showAddDialog ? handleAddItem : handleEditItem}
          >
            {showAddDialog ? "Add Item" : "Update Item"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
} 