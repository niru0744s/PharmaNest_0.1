import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface ReviewFormProps {
    productId: string;
    initialData?: {
        rating: number;
        comment: string;
        _id: string;
    };
    onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
    onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId: _productId, initialData, onSubmit, onCancel }) => {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState(initialData?.comment || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            return toast.error('Please select a rating');
        }

        if (comment.trim().length < 5) {
            return toast.error('Comment must be at least 5 characters');
        }

        setSubmitting(true);
        try {
            await onSubmit({ rating, comment: comment.trim() });
            toast.success(initialData ? 'Review updated' : 'Review submitted');
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {initialData ? 'Edit Your Review' : 'Write a Review'}
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`text-2xl transition-colors ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <FaStar />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Feedback
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="What did you like or dislike about this product?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300"
                    >
                        {submitting ? 'Submitting...' : initialData ? 'Update Review' : 'Post Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
