import React from 'react';
import { FaStar, FaThumbsUp, FaFlag, FaTrash, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { Review } from '../../services/reviewService';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewListProps {
    reviews: Review[];
    onDelete: (reviewId: string) => void;
    onEdit: (review: Review) => void;
    onHelpful: (reviewId: string) => void;
    onReport: (reviewId: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onDelete, onEdit, onHelpful, onReport }) => {
    const { user } = useAuth();

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {review.author.firstName.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">
                                    {review.author.firstName} {review.author.lastName}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {user?._id === review.author._id && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(review)}
                                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                    title="Edit review"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => onDelete(review._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete review"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}
                            />
                        ))}
                        {review.verifiedPurchase && (
                            <span className="ml-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
                                <FaCheckCircle /> Verified Purchase
                            </span>
                        )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{review.comment}</p>

                    <div className="flex items-center gap-4 border-t pt-4">
                        <button
                            onClick={() => onHelpful(review._id)}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${review.helpful.users.includes(user?._id || '')
                                    ? 'text-blue-600'
                                    : 'text-gray-500 hover:text-blue-600'
                                }`}
                        >
                            <FaThumbsUp /> Helpful ({review.helpful.count})
                        </button>
                        <button
                            onClick={() => onReport(review._id)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <FaFlag /> Report
                        </button>
                    </div>

                    {review.sellerResponse && (
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <h5 className="font-bold text-sm text-blue-600 mb-1">Response from Seller</h5>
                            <p className="text-sm text-gray-600">{review.sellerResponse.comment}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
