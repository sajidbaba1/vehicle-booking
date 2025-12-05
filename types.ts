export interface Vehicle {
  id: string;
  name: string;
  type: 'Car' | 'Bike' | 'SUV' | 'Luxury' | 'Van';
  pricePerDay: number;
  image: string;
  specs: {
    seats: number;
    transmission: 'Auto' | 'Manual';
    fuel: 'Electric' | 'Hybrid' | 'Petrol' | 'Diesel';
    range?: string; // For electric
  };
  rating: number;
  available: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export enum ViewState {
  HOME = 'HOME',
  BROWSE = 'BROWSE',
  AI_GENERATOR = 'AI_GENERATOR',
  BOOKING = 'BOOKING'
}
