import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Users, Gauge, Zap, Calendar, Shield, Share2, Heart, Check, X, CheckCircle, MessageCircle, Wallet, CreditCard, ChevronRight, Navigation, Download, Send, ShieldCheck } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../contexts/AuthContext';
import BookingChatModal from './BookingChatModal';
import PaymentModal from './PaymentModal';
import { generateReceipt } from '../utils/receiptGenerator';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onBack: () => void;
}

type BookingStep = 'itinerary' | 'location' | 'payment' | 'success';

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle, onBack }) => {
  const { addBooking, user, toggleWishlist, wishlist, submitReview, bookings } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('itinerary');
  
  // Review State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Booking Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLoc, setPickupLoc] = useState(vehicle.location);
  const [dropoffLoc, setDropoffLoc] = useState(vehicle.location);

  const isLiked = wishlist.has(vehicle.id);

  // Simple date calculation
  const getDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const days = getDays();
  const serviceFee = 150;
  const totalAmount = days * vehicle.pricePerDay + serviceFee;

  const handleNextStep = () => {
    if (bookingStep === 'itinerary') {
        if (!startDate || !endDate) return alert('Please select dates');
        setBookingStep('location');
    } else if (bookingStep === 'location') {
        if (!pickupLoc) return alert('Please set pickup location');
        setBookingStep('payment');
    }
  };

  const handlePaymentSuccess = async () => {
    setIsPaymentModalOpen(false);
    await addBooking(vehicle, startDate, endDate, totalAmount);
    setBookingStep('success');
  };

  const closeBooking = () => {
    setIsBookingModalOpen(false);
    setBookingStep('itinerary');
    setStartDate('');
    setEndDate('');
  };

  const handleSubmitReview = async () => {
      if (!reviewComment.trim()) return;
      setIsSubmittingReview(true);
      await submitReview(vehicle.id, reviewRating, reviewComment);
      setReviewComment('');
      setIsSubmittingReview(false);
  };

  const getLastBooking = () => {
      // Return the most recent booking for this vehicle to generate receipt in success view
      return bookings.find(b => b.vehicleId === vehicle.id && b.status === 'Pending'); // Status is Pending immediately after addBooking
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-dark-900 min-h-screen pt-20 pb-12 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="py-6 flex items-center justify-between">
           <button 
             onClick={onBack}
             className="flex items-center text-gray-400 hover:text-white transition-colors group"
           >
             <div className="p-2 rounded-full border border-white/10 bg-white/5 mr-3 group-hover:border-gold-500/50">
               <ArrowLeft className="w-4 h-4" />
             </div>
             <span className="text-sm uppercase tracking-widest font-bold">Back to Fleet</span>
           </button>
           
           <div className="flex gap-4">
              <button className="p-2 rounded-full border border-white/10 bg-white/5 hover:text-gold-500 hover:border-gold-500/50 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => toggleWishlist(vehicle.id)}
                className={`p-2 rounded-full border border-white/10 bg-white/5 hover:text-red-500 hover:border-red-500/50 transition-colors ${isLiked ? 'text-red-500 border-red-500/50' : ''}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
           </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Main Image */}
          <div className="lg:col-span-9 h-[500px] md:h-[600px] rounded-2xl overflow-hidden relative border border-white/5">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0.8, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={vehicle.images[activeImage]} 
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-8 left-8">
               <div className="flex items-center gap-2 mb-2">
                 <div className="bg-gold-500 text-dark-900 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                   {vehicle.type}
                 </div>
                 {vehicle.available && (
                   <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                     Available Now
                   </div>
                 )}
               </div>
               <h1 className="text-4xl md:text-5xl font-serif text-white">{vehicle.name}</h1>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-hidden">
             {vehicle.images.map((img, idx) => (
               <button 
                 key={idx}
                 onClick={() => setActiveImage(idx)}
                 className={`relative rounded-xl overflow-hidden h-24 lg:h-auto flex-1 border-2 transition-all ${
                   activeImage === idx ? 'border-gold-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                 }`}
               >
                 <img src={img} alt="" className="w-full h-full object-cover" />
               </button>
             ))}
             <div className="bg-dark-800 rounded-xl p-6 flex flex-col justify-between flex-1 border border-white/5">
                <div>
                   <div className="flex items-center gap-2 text-gold-500 mb-2">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-lg font-bold font-display">{vehicle.rating}</span>
                      <span className="text-gray-500 text-xs">({vehicle.reviewCount} reviews)</span>
                   </div>
                   <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{vehicle.location}</span>
                   </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                   <button 
                     onClick={() => setIsChatOpen(true)}
                     className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                   >
                      <MessageCircle className="w-4 h-4" />
                      Chat with Vendor
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Left Column: Info */}
           <div className="lg:col-span-8 space-y-12">
              
              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
                    <Gauge className="w-6 h-6 text-gold-500 mx-auto mb-3" />
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Engine</p>
                    <p className="text-white font-medium font-display">{vehicle.specs.engine || 'N/A'}</p>
                 </div>
                 <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
                    <Zap className="w-6 h-6 text-gold-500 mx-auto mb-3" />
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">0-60 MPH</p>
                    <p className="text-white font-medium font-display">{vehicle.specs.acceleration || 'N/A'}</p>
                 </div>
                 <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
                    <Gauge className="w-6 h-6 text-gold-500 mx-auto mb-3" />
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Power</p>
                    <p className="text-white font-medium font-display">{vehicle.specs.power || 'N/A'}</p>
                 </div>
                 <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
                    <Users className="w-6 h-6 text-gold-500 mx-auto mb-3" />
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Seats</p>
                    <p className="text-white font-medium font-display">{vehicle.specs.seats}</p>
                 </div>
              </div>

              {/* Description */}
              <div>
                 <h3 className="text-2xl font-serif text-white mb-6">About this Vehicle</h3>
                 <p className="text-gray-400 leading-relaxed text-lg font-light">
                    {vehicle.description}
                 </p>
              </div>

              {/* Features */}
              <div>
                 <h3 className="text-2xl font-serif text-white mb-6">Features & Amenities</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-dark-800 border border-white/5 rounded-lg">
                         <div className="bg-gold-500/10 p-1 rounded-full">
                            <Check className="w-3 h-3 text-gold-500" />
                         </div>
                         <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Reviews Section */}
              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-2xl font-serif text-white">Guest Reviews</h3>
                   <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                      <span className="text-2xl font-display font-bold text-white">{vehicle.rating}</span>
                      <span className="text-gray-500 text-sm">/ 5.0</span>
                   </div>
                </div>
                
                {/* Add Review */}
                {user && (
                  <div className="bg-dark-800 border border-white/5 p-6 rounded-xl mb-8">
                      <h4 className="text-white font-medium mb-4">Write a Review</h4>
                      <div className="flex gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => setReviewRating(star)}>
                                  <Star className={`w-5 h-5 ${star <= reviewRating ? 'text-gold-500 fill-gold-500' : 'text-gray-600'}`} />
                              </button>
                          ))}
                      </div>
                      <textarea 
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience..."
                          className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none mb-4 min-h-[100px]"
                      />
                      <button 
                          onClick={handleSubmitReview}
                          disabled={isSubmittingReview || !reviewComment.trim()}
                          className="bg-white text-dark-900 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors disabled:opacity-50"
                      >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                  </div>
                )}

                <div className="space-y-6">
                   {vehicle.reviews && vehicle.reviews.length > 0 ? (
                      vehicle.reviews.map(review => (
                        <div key={review.id} className="bg-dark-800 border border-white/5 p-6 rounded-xl">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gold-500 font-bold">
                                    {review.userName.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-white font-medium">{review.userName}</p>
                                    <p className="text-xs text-gray-500">{review.date}</p>
                                 </div>
                              </div>
                              <div className="flex gap-1">
                                 {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-600'}`} />
                                 ))}
                              </div>
                           </div>
                           <p className="text-gray-400 text-sm leading-relaxed">"{review.comment}"</p>
                        </div>
                      ))
                   ) : (
                      <p className="text-gray-500 italic">No reviews yet for this vehicle.</p>
                   )}
                </div>
              </div>

           </div>

           {/* Right Column: Booking Card (Sticky) */}
           <div className="lg:col-span-4">
              <div className="sticky top-28">
                 <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl gold-glow bg-dark-800/80">
                    <div className="flex justify-between items-end mb-6 pb-6 border-b border-white/5">
                       <div>
                          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Daily Rate</p>
                          <div className="flex items-baseline">
                             <span className="text-3xl font-display text-white font-bold">${vehicle.pricePerDay}</span>
                             <span className="text-gray-500 ml-2">/ day</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-gold-500/5 border border-gold-500/20 p-4 rounded-lg mb-6">
                       <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                          <div>
                             <p className="text-gold-500 text-xs font-bold uppercase tracking-wide mb-1">Prestige Assurance</p>
                             <p className="text-[10px] text-gray-400 leading-relaxed">
                               Includes comprehensive insurance, 24/7 concierge support, and roadside assistance.
                             </p>
                          </div>
                       </div>
                    </div>

                    <button 
                       onClick={() => setIsBookingModalOpen(true)}
                       className="w-full bg-gold-gradient text-dark-900 font-bold uppercase text-xs tracking-[0.2em] py-4 rounded-sm hover:shadow-[0_0_20px_rgba(198,166,103,0.3)] transition-all"
                    >
                       Check Availability
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-600 mt-4">
                       You won't be charged until the vendor confirms.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Multi-step Booking Modal */}
        <AnimatePresence>
           {isBookingModalOpen && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   exit={{ opacity: 0 }}
                   onClick={closeBooking}
                   className="absolute inset-0 bg-black/90 backdrop-blur-md"
                />
                <motion.div
                   initial={{ opacity: 0, scale: 0.95, y: 30 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 30 }}
                   className="relative bg-dark-800 border border-gold-500/20 w-full max-w-2xl rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
                >
                   {/* Modal Header */}
                   <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-dark-900">
                      <div>
                         <h3 className="text-xl font-serif text-white">Complete Your Reservation</h3>
                         <div className="flex items-center gap-2 mt-2">
                             {['Itinerary', 'Location', 'Payment'].map((step, idx) => {
                                 const stepKey = step.toLowerCase() as BookingStep;
                                 const isActive = bookingStep === stepKey;
                                 const isPassed = ['itinerary', 'location', 'payment'].indexOf(bookingStep) > idx;
                                 return (
                                     <div key={step} className="flex items-center">
                                         <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive || isPassed ? 'text-gold-500' : 'text-gray-600'}`}>
                                            {step}
                                         </span>
                                         {idx < 2 && <ChevronRight className="w-3 h-3 text-gray-700 mx-2" />}
                                     </div>
                                 );
                             })}
                         </div>
                      </div>
                      <button onClick={closeBooking} className="text-gray-500 hover:text-white p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                         <X className="w-5 h-5" />
                      </button>
                   </div>

                   {/* Modal Content */}
                   <div className="p-8 overflow-y-auto">
                       {/* STEP 1: ITINERARY */}
                       {bookingStep === 'itinerary' && (
                           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                               <h4 className="text-lg text-white font-medium mb-6">Choose your dates</h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pick-up Date</label>
                                       <div className="bg-dark-900 border border-white/10 rounded-xl p-4 flex items-center text-white focus-within:border-gold-500 transition-colors">
                                           <Calendar className="w-5 h-5 text-gold-500 mr-3" />
                                           <input 
                                               type="date" 
                                               value={startDate}
                                               onChange={(e) => setStartDate(e.target.value)}
                                               className="bg-transparent border-none w-full focus:outline-none text-sm text-gray-300 font-display" 
                                           />
                                       </div>
                                   </div>
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Drop-off Date</label>
                                       <div className="bg-dark-900 border border-white/10 rounded-xl p-4 flex items-center text-white focus-within:border-gold-500 transition-colors">
                                           <Calendar className="w-5 h-5 text-gold-500 mr-3" />
                                           <input 
                                               type="date" 
                                               value={endDate}
                                               onChange={(e) => setEndDate(e.target.value)}
                                               className="bg-transparent border-none w-full focus:outline-none text-sm text-gray-300 font-display" 
                                           />
                                       </div>
                                   </div>
                               </div>
                               {days > 0 && (
                                   <div className="bg-gold-500/10 border border-gold-500/20 p-4 rounded-xl flex justify-between items-center">
                                       <span className="text-gold-500 font-bold text-sm">Duration: {days} Days</span>
                                       <span className="text-white font-display font-bold text-lg">Total: ${(days * vehicle.pricePerDay).toLocaleString()}</span>
                                   </div>
                               )}
                           </motion.div>
                       )}

                       {/* STEP 2: LOCATION */}
                       {bookingStep === 'location' && (
                           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                               <h4 className="text-lg text-white font-medium mb-6">Pick-up & Drop-off</h4>
                               <div className="space-y-6">
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pick-up Location</label>
                                       <div className="bg-dark-900 border border-white/10 rounded-xl p-4 flex items-center text-white focus-within:border-gold-500 transition-colors">
                                           <MapPin className="w-5 h-5 text-gold-500 mr-3" />
                                           <input 
                                               type="text" 
                                               value={pickupLoc}
                                               onChange={(e) => setPickupLoc(e.target.value)}
                                               className="bg-transparent border-none w-full focus:outline-none text-sm text-gray-300"
                                               placeholder="Enter address" 
                                           />
                                       </div>
                                   </div>
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Drop-off Location</label>
                                       <div className="bg-dark-900 border border-white/10 rounded-xl p-4 flex items-center text-white focus-within:border-gold-500 transition-colors">
                                           <Navigation className="w-5 h-5 text-gray-500 mr-3" />
                                           <input 
                                               type="text" 
                                               value={dropoffLoc}
                                               onChange={(e) => setDropoffLoc(e.target.value)}
                                               className="bg-transparent border-none w-full focus:outline-none text-sm text-gray-300"
                                               placeholder="Same as pick-up" 
                                           />
                                       </div>
                                   </div>
                               </div>
                           </motion.div>
                       )}

                       {/* STEP 3: PAYMENT */}
                       {bookingStep === 'payment' && (
                           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div>
                                       <h4 className="text-lg text-white font-medium mb-6">Payment Details</h4>
                                       <p className="text-gray-400 text-sm mb-6">
                                           You will be redirected to our secure payment gateway to complete this transaction.
                                       </p>
                                       <div className="flex gap-4 mb-8">
                                           <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-center gap-3 w-full">
                                                <div className="bg-green-500/10 p-2 rounded text-green-500">
                                                    <ShieldCheck className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm">Secure Checkout</p>
                                                    <p className="text-[10px] text-gray-400">256-bit SSL Encrypted</p>
                                                </div>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="bg-white/5 p-6 rounded-xl border border-white/10 h-fit">
                                       <h4 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4">Summary</h4>
                                       <div className="space-y-3 mb-4 border-b border-white/5 pb-4">
                                           <div className="flex justify-between text-sm">
                                               <span className="text-gray-400">{days} Days x ${vehicle.pricePerDay}</span>
                                               <span className="text-white font-display">${(days * vehicle.pricePerDay).toLocaleString()}</span>
                                           </div>
                                           <div className="flex justify-between text-sm">
                                               <span className="text-gray-400">Service Fee</span>
                                               <span className="text-white font-display">${serviceFee}</span>
                                           </div>
                                       </div>
                                       <div className="flex justify-between text-lg font-bold">
                                           <span className="text-white">Total</span>
                                           <span className="text-gold-500 font-display">${totalAmount.toLocaleString()}</span>
                                       </div>
                                   </div>
                               </div>
                           </motion.div>
                       )}

                        {/* STEP 4: SUCCESS */}
                        {bookingStep === 'success' && (
                             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                                   <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-3xl font-serif text-white mb-2">Booking Confirmed!</h3>
                                <p className="text-gray-400 max-w-sm mx-auto mb-8">
                                   Your reservation for the <span className="text-white font-bold">{vehicle.name}</span> has been secured. A confirmation email has been sent.
                                </p>
                                
                                <div className="flex gap-4 justify-center mb-8">
                                    <button 
                                        onClick={() => user && generateReceipt({
                                            id: getLastBooking()?.id || `bk_${Date.now()}`,
                                            vehicleId: vehicle.id,
                                            vehicleName: vehicle.name,
                                            vehicleImage: vehicle.image,
                                            startDate,
                                            endDate,
                                            totalPrice: totalAmount,
                                            status: 'Confirmed',
                                            date: new Date().toISOString()
                                        }, user)}
                                        className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-white/10"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Receipt
                                    </button>
                                    <button onClick={closeBooking} className="bg-gold-500 text-dark-900 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
                                        Return to Vehicle
                                    </button>
                                </div>
                             </motion.div>
                        )}
                   </div>

                   {/* Modal Footer (Nav Buttons) */}
                   {bookingStep !== 'success' && (
                       <div className="px-8 py-6 border-t border-white/10 bg-dark-900 flex justify-between items-center">
                           {bookingStep !== 'itinerary' ? (
                               <button 
                                   onClick={() => setBookingStep(bookingStep === 'payment' ? 'location' : 'itinerary')}
                                   className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest"
                               >
                                   Back
                               </button>
                           ) : <div></div>}
                           
                           <button 
                               onClick={bookingStep === 'payment' ? () => setIsPaymentModalOpen(true) : handleNextStep}
                               className="bg-gold-gradient text-dark-900 px-8 py-3 rounded-sm font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50"
                           >
                               {bookingStep === 'payment' ? `Pay $${totalAmount.toLocaleString()}` : 'Continue'}
                           </button>
                       </div>
                   )}
                </motion.div>
             </div>
           )}
        </AnimatePresence>
        
        <BookingChatModal 
           isOpen={isChatOpen}
           onClose={() => setIsChatOpen(false)}
           vehicle={vehicle}
        />

        <PaymentModal 
            isOpen={isPaymentModalOpen} 
            onClose={() => setIsPaymentModalOpen(false)}
            amount={totalAmount}
            description={`Booking: ${vehicle.name}`}
            onSuccess={handlePaymentSuccess}
        />

      </div>
    </motion.div>
  );
};

export default VehicleDetails;