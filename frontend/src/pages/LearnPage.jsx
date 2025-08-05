import React from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaRecycle, FaPlug, FaLeaf, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

// Data for our learning cards
const wasteCategories = [
  {
    title: 'Paper & Cardboard',
    icon: <FaPaperPlane className="text-blue-500" size={40} />,
    bgColor: 'bg-blue-50',
    description: 'Clean paper, newspapers, and cardboard can be recycled multiple times.',
    includes: ['Newspapers', 'Magazines', 'Office Paper', 'Cardboard Boxes', 'Junk Mail'],
    excludes: ['Greasy Pizza Boxes', 'Used Paper Towels', 'Waxed Paper', 'Stickers'],
  },
  {
    title: 'Plastics',
    icon: <FaRecycle className="text-orange-500" size={40} />,
    bgColor: 'bg-orange-50',
    description: 'Rinse containers and check the recycling symbol (usually #1 or #2 are accepted).',
    includes: ['Water Bottles (PET)', 'Milk Jugs (HDPE)', 'Shampoo Bottles', 'Clean Food Tubs'],
    excludes: ['Plastic Bags/Film', 'Styrofoam', 'Chip Bags', 'Plastic Cutlery'],
  },
  {
    title: 'E-Waste (Electronics)',
    icon: <FaPlug className="text-gray-600" size={40} />,
    bgColor: 'bg-gray-100',
    description: 'Electronic waste contains harmful materials and must be disposed of separately.',
    includes: ['Old Phones', 'Chargers & Cables', 'Batteries', 'Laptops', 'Keyboards'],
    excludes: ['Large Appliances (check locally)', 'Light Bulbs (some types)'],
  },
  {
    title: 'Organic (Wet Waste)',
    icon: <FaLeaf className="text-green-500" size={40} />,
    bgColor: 'bg-green-50',
    description: 'This waste can be composted to create nutrient-rich soil.',
    includes: ['Fruit & Vegetable Peels', 'Leftover Food', 'Tea Bags', 'Eggshells', 'Garden Waste'],
    excludes: ['Plastics', 'Metals', 'Cooking Oil', 'Dairy Products (can attract pests)'],
  },
];

const LearnPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Become a Recycling Champion
        </h1>

        {/* SVG Bins Illustration */}
        <svg
          className="w-full max-w-md mx-auto mt-6"
          viewBox="0 0 500 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue Paper Bin */}
          <path d="M70 70L90 50H130L150 70V180H70V70Z" fill="#3B82F6" rx="5" />
          <rect x="75" y="75" width="70" height="5" fill="#93C5FD" />
          <text
            x="110"
            y="140"
            fill="white"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
          >
            <tspan x="110" dy="0">
              PAPER &
            </tspan>
            <tspan x="110" dy="20">
              C.BOARD
            </tspan>
          </text>

          {/* Green Organic Bin */}
          <path
            d="M200 70L220 50H260L280 70V180H200V70Z"
            fill="#10B981"
            rx="5"
          />
          <rect x="205" y="75" width="70" height="5" fill="#6EE7B7" />
          <text
            x="240"
            y="140"
            fill="white"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
          >
            <tspan x="240" dy="0">
              ORGANIC
            </tspan>
            <tspan x="240" dy="20">
              WASTE
            </tspan>
          </text>

          {/* Yellow Plastic Bin */}
          <path
            d="M330 70L350 50H390L410 70V180H330V70Z"
            fill="#F59E0B"
            rx="5"
          />
          <rect x="335" y="75" width="70" height="5" fill="#FCD34D" />
          <text
            x="370"
            y="140"
            fill="white"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
          >
            <tspan x="370" dy="0">
              PLASTICS
            </tspan>
            <tspan x="370" dy="20">
              & METAL
            </tspan>
          </text>

          {/* Bin Lids */}
          <rect x="65" y="50" width="90" height="10" fill="#1D4ED8" rx="2" />
          <rect x="195" y="50" width="90" height="10" fill="#047857" rx="2" />
          <rect x="325" y="50" width="90" height="10" fill="#D97706" rx="2" />
        </svg>
        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          Proper waste segregation is the first step towards a cleaner planet.
          Learn how to sort your waste correctly right here.
        </p>
      </div>

      {/* Waste Category Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {wasteCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`rounded-xl shadow-lg p-6 flex flex-col ${category.bgColor}`}
          >
            <div className="flex items-center mb-4">
              {category.icon}
              <h2 className="text-2xl font-bold ml-4 text-gray-800">
                {category.title}
              </h2>
            </div>
            <p className="text-gray-600 mb-6 flex-grow">
              {category.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What Goes In */}
              <div>
                <h3 className="font-bold text-lg mb-2 text-green-700">
                  What Goes In
                </h3>
                <ul>
                  {category.includes.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center mb-1 text-gray-700"
                    >
                      <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Stays Out */}
              <div>
                <h3 className="font-bold text-lg mb-2 text-red-700">
                  What Stays Out
                </h3>
                <ul>
                  {category.excludes.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center mb-1 text-gray-700"
                    >
                      <FaTimesCircle className="text-red-500 mr-2 flex-shrink-0" />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Educational Documentation Section - Compact Version */}
<div className="mt-12 p-4 bg-gray-50 rounded-lg max-w-5xl mx-auto">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">The Science of Smart Waste Management</h2>
  
  <div className="grid md:grid-cols-2 gap-4">
    {/* Column 1 */}
    <div className="space-y-4">
      {/* Waste Hierarchy Card */}
      <div className="min-h-[180px] p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
        <h3 className="text-lg font-semibold mb-2">The Waste Hierarchy</h3>
        <ol className="list-decimal pl-4 space-y-1 text-sm">
          <li><strong>Prevention:</strong> Reduce consumption</li>
          <li><strong>Reuse:</strong> Repurpose items</li>
          <li><strong>Recycle:</strong> Process materials</li>
          <li><strong>Recovery:</strong> Energy generation</li>
          <li><strong>Disposal:</strong> Last resort</li>
        </ol>
      </div>

      {/* Material Lifecycles Card */}
      <div className="min-h-[180px] p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold mb-2">Material Lifecycles</h3>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Paper:</span> 5-7 recycles</p>
          <p><span className="font-medium">Plastic:</span> Downcycles</p>
          <p><span className="font-medium">Glass:</span> Infinite recycling</p>
          <p><span className="font-medium">Organic:</span> 2-12mo compost</p>
        </div>
      </div>
    </div>

    {/* Column 2 */}
    <div className="space-y-4">
      {/* Segregation Matters Card */}
      <div className="min-h-[180px] p-4 bg-white rounded-lg shadow-sm border-l-4 border-amber-500">
        <h3 className="text-lg font-semibold mb-2">Segregation Benefits</h3>
        <ul className="space-y-1 text-sm">
          <li className="flex items-start">
            <span className="text-green-500 mr-1">✓</span>
            <span>Prevents contamination</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-1">✓</span>
            <span>Efficient processing</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-1">✓</span>
            <span>Reduces landfill volume</span>
          </li>
        </ul>
      </div>

      {/* Global Impact Card */}
      <div className="min-h-[180px] p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
        <h3 className="text-lg font-semibold mb-2">Global Impact</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-purple-50 p-2 rounded">
            <p className="font-medium">Recycled paper:</p>
            <p>17 trees saved</p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <p className="font-medium">Aluminum:</p>
            <p>95% energy saved</p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <p className="font-medium">Food waste:</p>
            <p>8% global GHGs</p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <p className="font-medium">E-waste:</p>
            <p>Contains metals</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Compact Call to Action */}
  <div className="mt-6 text-center bg-green-50 p-4 rounded-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Do More?</h3>
    <p className="text-sm mb-2">
      Explore Indian guidelines: 
      <a href="https://sbmurban.org/" 
         className="text-blue-600 underline ml-1" 
         target="_blank" 
         rel="noopener noreferrer">
        Swachh Bharat
      </a>
    </p>
    <button className="text-sm bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-full">
      Calculate Footprint
    </button>
  </div>
</div>
        
    </motion.div>
  );
};

export default LearnPage;