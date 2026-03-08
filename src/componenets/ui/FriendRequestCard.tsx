import React from 'react';
import type { FriendRequest } from '../../types/friend';

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept?: (requestId: number) => void;
  onDecline?: (requestId: number) => void;
  onCancel?: (requestId: number) => void;
  isPending?: boolean;
  type: 'sent' | 'received';
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onAccept,
  onDecline,
  onCancel,
  isPending = false,
  type,
}) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {type === 'received' ? request.senderName.charAt(0).toUpperCase() : request.receiverId.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {type === 'received' ? request.senderName : `To: ${request.receiverId}`}
            </p>
            {request.message && (
              <p className="text-sm text-gray-600 mt-1">{request.message}</p>
            )}
            <p className="text-xs text-gray-500">
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {type === 'received' ? (
            <>
              <button
                onClick={() => onAccept?.(request.id)}
                disabled={isPending}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => onDecline?.(request.id)}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Decline
              </button>
            </>
          ) : (
            request.status === 'pending' && onCancel && (
              <button
                onClick={() => onCancel(request.id)}
                disabled={isPending}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            )
          )}
        </div>
      </div>
      {request.status !== 'pending' && (
        <div className="mt-3">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            request.status === 'accepted'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default FriendRequestCard;