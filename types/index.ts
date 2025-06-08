export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  prepTime: string;
  image: string;
  distance: string;
  featured?: boolean;
  priceRange?: string;
  description?: string;
  address?: string;
  phone?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  calories?: number;
  customizations?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: { [key: string]: string[] };
  totalPrice: number;
}

export interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  estimatedTime: string;
  orderTime: string;
  orderNumber: string;
  pickupTime?: string;
  isActive: boolean;
  rating?: number;
}

export interface LiveOrderUpdate {
  orderId: string;
  status: Order['status'];
  estimatedTime: string;
  message?: string;
  timestamp: string;
}