import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={ratingValue}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            className="hidden"
                        />
                        <FaStar
                            className="cursor-pointer"
                            color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                            size={40}
                        />
                    </label>
                );
            })}
        </div>
    );
};

const ReviewForm = ({ bookingId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a star rating.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/reviews', { bookingId, rating, comment });
            toast.success("Thank you for your review!");
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data || "Failed to submit review.");
            console.error("Review submission failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-center text-lg font-medium text-gray-700 mb-2">Your Rating</label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comments (Optional)</label>
                <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Share your experience..."
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
            >
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

export default ReviewForm;