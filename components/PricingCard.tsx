"use client";

// PricingCard component
export const PricingCard = () => {
  return (
    <div className="flex flex-col items-start justify-start p-4 sm:p-6 md:p-8 bg-black rounded-lg shadow-lg max-w-full sm:max-w-lg md:max-w-xl mx-auto space-y-6">
      <div className="text-left w-full">
        {/* Subscription Plan */}
        <div className="flex flex-col items-start space-y-4 sm:space-y-6">
          <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">
            Subscription Plan
          </p>
          <p className="text-white font-bold text-lg sm:text-xl md:text-2xl">
            ₹199 /month
          </p>
          <p className="text-white text-md sm:text-lg md:text-xl">
            Includes 
          </p>

          {/* Description of the subscription benefits */}
          <ul className="text-white text-sm sm:text-md md:text-lg list-disc space-y-2 sm:space-y-4 ml-4 sm:ml-6">
            <li>Track real-time data</li>
            <li>Improve operational performance</li>
            <li>Manage up to 10,000 patients monthly</li>
            <li>Ensure speed, efficiency, and scalability</li>
          </ul>
        </div>
      </div>
    </div>
  );
};   