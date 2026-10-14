import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, MessageSquare, ThumbsUp, X } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  product: string;
  comment: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [];

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    rating: 5,
    product: '',
    comment: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const item: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: newReview.name,
      location: newReview.location || 'Sri Lanka',
      rating: newReview.rating,
      date: 'Just now',
      verified: true,
      product: newReview.product || 'Artisan Provision',
      comment: newReview.comment,
    };

    setReviews([item, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setNewReview({ name: '', location: '', rating: 5, product: '', comment: '' });
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C]">
          Customer Reviews
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B5132] tracking-tight">
          What Our Customers Say
        </h1>
        <p className="text-sm sm:text-base text-[#4A4A4A] max-w-md mx-auto">
          We appreciate every order and every piece of feedback.
        </p>
      </div>

      {/* Summary Score Card */}
      <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0] flex flex-col items-center justify-center">
            <span className="font-serif text-2xl font-bold text-[#1B5132]">4.8</span>
            <span className="text-[10px] text-[#6B6B6B]">out of 5</span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[#D9A441]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#1F3D2B] mt-1">
              Based on verified orders across Sri Lanka
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="min-h-[44px] px-6 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white font-sans text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Leave a Review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="bg-white border border-[#EADFD0] rounded-2xl p-10 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-[#8B5E3C] mx-auto opacity-40" />
          <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">No reviews yet</h3>
          <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mx-auto">
            Be the first to share your experience with our artisan provisions!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#EADFD0] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D9A441]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-[#EADFD0]'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#6B6B6B]">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#2B2B2B] leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#EADFD0]/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1F3D2B] block">{rev.name}</span>
                  <span className="text-[11px] text-[#6B6B6B]">{rev.location}</span>
                </div>
                {rev.verified && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#2E7D4F]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Order</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EADFD0]">
                <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
                  Share Your Feedback
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#2B2B2B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-[#2E7D4F] mx-auto" />
                  <p className="font-semibold text-sm text-[#1F3D2B]">
                    Thank you! Your review has been submitted.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Rating</label>
                    <div className="flex items-center gap-1.5 text-[#D9A441]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${star <= newReview.rating ? 'fill-current' : 'text-[#EADFD0]'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="e.g. Kasun Fernando"
                      className="w-full h-10 px-3 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Location</label>
                    <input
                      type="text"
                      value={newReview.location}
                      onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                      placeholder="e.g. Colombo / Kandy"
                      className="w-full h-10 px-3 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Product Purchased</label>
                    <input
                      type="text"
                      value={newReview.product}
                      onChange={(e) => setNewReview({ ...newReview, product: e.target.value })}
                      placeholder="e.g. Walnuts (Akhrot) / Medjool Dates"
                      className="w-full h-10 px-3 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Your Review *</label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience regarding the quality, packaging, and delivery..."
                      className="w-full p-3 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-full bg-[#1B5132] text-white text-xs font-semibold hover:bg-[#143E26] transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
