
export interface LoginError {
  email?: Array<String>;
  password?: Array<String>;
}

export interface ProductType {
  image: string;
  id: number;
  name: string;
  image_url: string;
  price: string;
  updated_at: string;
  created_at: string;
}

export interface SideBarProps {
  isOpen: boolean;
}