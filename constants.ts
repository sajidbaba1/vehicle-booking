import { Vehicle } from './types';

export const VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'Tesla Model S Plaid',
    type: 'Luxury',
    pricePerDay: 250,
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620882855639-c5c8f615e44c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1642436125071-c4233e7906d4?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Experience the future of acceleration. The Model S Plaid is the highest performing sedan ever built, featuring tri-motor all-wheel drive and a minimalist luxury interior.',
    features: ['Autopilot', 'Yoke Steering', '21" Arachnid Wheels', 'Premium Audio', 'Gaming Computer'],
    specs: { 
      seats: 5, 
      transmission: 'Auto', 
      fuel: 'Electric', 
      range: '396 mi',
      engine: 'Tri-Motor',
      acceleration: '1.99s',
      power: '1,020 hp'
    },
    rating: 4.9,
    reviewCount: 128,
    available: true,
    reviews: [
      { id: 'r1', userId: 'u2', userName: 'Sarah Jenkins', rating: 5, comment: 'Absolutely mind-bending acceleration. The interior is minimal but very comfortable.', date: '2023-11-15' },
      { id: 'r2', userId: 'u3', userName: 'Mike Ross', rating: 4, comment: 'Great car, but charging infrastructure in the mountains was a bit tricky.', date: '2023-10-20' }
    ]
  },
  {
    id: '2',
    name: 'Porsche 911 GT3',
    type: 'Supercar',
    pricePerDay: 1250,
    location: 'Miami, FL',
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611821064430-0d41049a60e4?q=80&w=2071&auto=format&fit=crop'
    ],
    description: 'A purebred sports car. Connection to the road is visceral. The naturally aspirated 4.0-liter flat-six engine sings a mechanical symphony up to 9,000 RPM.',
    features: ['Carbon Ceramic Brakes', 'Bucket Seats', 'Club Sport Package', 'Front Axle Lift'],
    specs: { 
      seats: 2, 
      transmission: 'Manual', 
      fuel: 'Petrol',
      engine: '4.0L Flat-6',
      acceleration: '3.2s',
      power: '502 hp'
    },
    rating: 5.0,
    reviewCount: 84,
    available: true,
    reviews: [
      { id: 'r3', userId: 'u4', userName: 'James Bond', rating: 5, comment: 'Perfection on wheels. The sound at 9000 RPM is addictive.', date: '2023-12-01' }
    ]
  },
  {
    id: '3',
    name: 'Range Rover Autobiography',
    type: 'SUV',
    pricePerDay: 450,
    location: 'Aspen, CO',
    image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1675069503434-22b0475b0351?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Refined capability. The Range Rover Autobiography offers peerless luxury and off-road prowess in one sophisticated package.',
    features: ['Massage Seats', 'Executive Class Rear Seating', 'Meridian Signature Sound', 'All-Wheel Steering'],
    specs: { 
      seats: 5, 
      transmission: 'Auto', 
      fuel: 'Diesel',
      engine: 'V8 Twin Turbo',
      acceleration: '4.4s',
      power: '523 hp'
    },
    rating: 4.8,
    reviewCount: 210,
    available: true,
    reviews: []
  },
  {
    id: '4',
    name: '1967 Ford Mustang Shelby',
    type: 'Classic',
    pricePerDay: 800,
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Eleanor. A piece of American automotive history. Raw, untamed, and undeniably cool. Perfect for photoshoots or coastal cruises.',
    features: ['Restomod Interior', 'Bluetooth Vintage Radio', 'Nitrous (Show only)'],
    specs: { 
      seats: 4, 
      transmission: 'Manual', 
      fuel: 'Petrol',
      engine: 'V8 428',
      acceleration: '5.5s',
      power: '355 hp'
    },
    rating: 4.9,
    reviewCount: 45,
    available: true,
    reviews: []
  },
  {
    id: '5',
    name: 'Rolls-Royce Ghost',
    type: 'Luxury',
    pricePerDay: 1800,
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1631295868223-6326585131f4?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1631295868223-6326585131f4?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Post-opulence. The Ghost is the purest expression of Rolls-Royce. It whispers rather than shouts, offering a magic carpet ride.',
    features: ['Starlight Headliner', 'Champagne Cooler', 'Lambswool Floormats', 'Privacy Suite'],
    specs: { 
      seats: 5, 
      transmission: 'Auto', 
      fuel: 'Petrol',
      engine: '6.75L V12',
      acceleration: '4.6s',
      power: '563 hp'
    },
    rating: 5.0,
    reviewCount: 32,
    available: true,
    reviews: []
  },
  {
    id: '6',
    name: 'Ducati Panigale V4',
    type: 'Bike',
    pricePerDay: 200,
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop',
    images: [
       'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Born on the track. The Panigale V4 is the closest thing to a MotoGP bike you can ride on the street. Intense and precise.',
    features: ['Öhlins Suspension', 'Brembo Stylema Brakes', 'Cornering ABS'],
    specs: { 
      seats: 1, 
      transmission: 'Manual', 
      fuel: 'Petrol',
      engine: '1103cc V4',
      acceleration: '2.8s',
      power: '210 hp'
    },
    rating: 5.0,
    reviewCount: 67,
    available: true,
    reviews: []
  },
];