import React, { useEffect, useCallback } from "react";
import Image from "next/image";

const Modal = ({ event, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [handleEscapeKey]);

  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 border-[2.5px] border-slate-900 rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative border-b-2 border-slate-900">
          <Image
            src={event.image}
            alt={event.title}
            // layout="fill"
            width={1000}
            height={300}
            objectFit="cover"
          />
        </div>
        <div className="px-8 pb-8 pt-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {event.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {event.description}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Time:</strong> {formatTimestamp(event.timestamp)}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            <strong>Location:</strong> {event.location}
          </p>
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block"
          >
            More Info
          </a>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
