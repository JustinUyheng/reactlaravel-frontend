import React, { useState, useEffect } from 'react';
// Make sure to import useLocation and Link
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './RecStyle/AddItems.css';
import { assets } from '../assets/assets';
import ListItems from './ListItems'; // Assuming ListItems.jsx is in the same folder
import Orderss from './Orderss';   // Assuming Orderss.jsx is in the same folder

// Keep CheckIcon and RemoveIcon components
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white" />
  </svg>
);

const RemoveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Helper functions (calculateOrderTotal, countOrderItems) remain the same
const calculateOrderTotal = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity, 10) || 1;
    const itemFee = parseFloat(item.fee) || 0;
    return sum + (price * quantity) + itemFee;
  }, 0);
};

const countOrderItems = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
};

const AddItems = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  // Determine active tab from URL path
  const getActiveTabFromPath = (pathname) => {
    if (pathname.startsWith('/vendor-list-items')) return 'listItems';
    if (pathname.startsWith('/vendor-orders')) return 'orders';
    if (pathname.startsWith('/vendor-add-items')) return 'addItems';
    // Fallback or if the base path /record still leads here and should show 'addItems'
    if (pathname.startsWith('/record')) return 'addItems';
    return 'addItems'; // Default to addItems
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(location.pathname));

  // State for Add Items Tab (productName, productDescription, etc.)
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('Meals');
  const [productPrice, setProductPrice] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for List Items Tab
  const [itemsList, setItemsList] = useState(() => {
    const savedItems = localStorage.getItem('foodItems');
    const defaultItems = [
      { id: 1, image: assets.food_1 || assets.placeholder, name: 'Beef patty burger', category: 'Meals', price: '25', description: 'A classic beef patty burger.' },
      { id: 2, image: assets.food_2 || assets.placeholder, name: 'Chicken fillet burger', category: 'Meals', price: '40', description: 'Crispy chicken fillet burger.' },
    ];
    try {
      const parsed = savedItems ? JSON.parse(savedItems) : defaultItems;
      return Array.isArray(parsed) ? parsed : defaultItems;
    } catch (error) {
      console.error("Failed to parse food items from localStorage:", error);
      return defaultItems;
    }
  });

  // State for Orders Tab
  const [orders, setOrders] = useState([]);
  const orderStatuses = ['Food Processing', 'Ready for pickup', 'Item picked up'];
  const categories = ['Meals', 'Drinks', 'Snacks', 'Desserts'];

  // Effect to update activeTab when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(location.pathname));
  }, [location.pathname]);

  // Effect to Load Orders from localStorage
  useEffect(() => {
    if (activeTab === 'orders') {
      // ... (rest of the useEffect logic for loading orders remains the same)
      console.log("Fetching order history for Orders tab...");
      const history = localStorage.getItem('orderHistory');
      let processedOrders = [];
      if (history) {
        try {
          const parsedHistory = JSON.parse(history);
          if (Array.isArray(parsedHistory)) {
            processedOrders = parsedHistory.map((order, index) => ({
              ...order,
              id: order.uniqueOrderId || order.orderId || `${order.timestamp}-${index}`,
              status: order.status || 'Food Processing',
              customer: order.customer || {
                name: `Customer #${index + 1}`,
                location: order.location || "Unknown Location",
                id: order.customerId || `ID-${Date.now().toString().slice(-6) + index}`
              },
              items: Array.isArray(order.items) ? order.items : []
            })).reverse();
          }
        } catch (error) {
          console.error("Failed to parse order history:", error);
        }
      }
      setOrders(processedOrders);
    }
  }, [activeTab]);

  // Effect to save food items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foodItems', JSON.stringify(itemsList));
    } catch (error) {
      console.error("Failed to save food items to localStorage:", error);
    }
  }, [itemsList]);

  // handleTabClick - This function can be simplified if Link is handling navigation
  // We'll keep it to set the activeTab for styling purposes, Link handles the navigation itself
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };

  // handleImageUpload, handleAddClick, handleRemoveItem, handleStatusChange remain the same
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setImagePreview(null); setImageFile(null);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null); setImagePreview(null);
    }
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice.trim() || !productCategory || !imagePreview) {
      alert('Please fill in Product Name, Category, Price, and upload an Image.');
      return;
    }
    const newItem = {
      id: Date.now(), name: productName.trim(), description: productDescription.trim(),
      category: productCategory, price: parseFloat(productPrice).toFixed(2), image: imagePreview
    };
    setItemsList(prevItems => [newItem, ...prevItems]);
    setShowSuccessMessage(true);
    setProductName(''); setProductDescription(''); setProductCategory('Meals');
    setProductPrice(''); setImageFile(null); setImagePreview(null);
    if (document.getElementById('imageUpload')) document.getElementById('imageUpload').value = "";
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleRemoveItem = (idToRemove) => {
    if (window.confirm("Are you sure you want to remove this food item?")) {
      setItemsList(prevItems => prevItems.filter(item => item.id !== idToRemove));
    }
  };

  const handleStatusChange = (orderIdToUpdate, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderIdToUpdate ? { ...order, status: newStatus } : order
      )
    );
    try {
      const currentOrderHistoryRaw = localStorage.getItem('orderHistory');
      const currentOrderHistory = currentOrderHistoryRaw ? JSON.parse(currentOrderHistoryRaw) : [];
      if (Array.isArray(currentOrderHistory)) {
        const orderFromStateThatChanged = orders.find(o => o.id === orderIdToUpdate);
        const updatedHistory = currentOrderHistory.map(histOrder => {
          let isMatch = false;
          if (orderFromStateThatChanged) {
            if (orderFromStateThatChanged.uniqueOrderId && histOrder.uniqueOrderId === orderFromStateThatChanged.uniqueOrderId) isMatch = true;
            else if (orderFromStateThatChanged.orderId && histOrder.orderId === orderFromStateThatChanged.orderId) isMatch = true;
            else if (!orderFromStateThatChanged.uniqueOrderId && !orderFromStateThatChanged.orderId && histOrder.timestamp === orderFromStateThatChanged.timestamp) isMatch = true;
          }
          if (isMatch) return { ...histOrder, status: newStatus, fee: histOrder.fee };
          return histOrder;
        });
        localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error("Failed to update order status in localStorage:", error);
    }
  };

  return (
    <div className="additems-page-container">
      <div className="additems-body-container">
        {/* Sidebar */}
        <aside className="additems-sidebar">
          <h2 className="additems-sidebar-title">France Bistro</h2>
          <nav>
            <ul>
              {/* Use Link for navigation and onClick to set active tab for styling */}
              <li>
                <Link
                  to="/vendor-add-items" // New path for Add Items
                  className={`additems-sidebar-item ${activeTab === 'addItems' ? 'active' : ''}`}
                  onClick={() => handleSetActiveTab('addItems')}
                >
                  <img src={assets.add} alt="Add Items Icon" className="sidebar-icon" /> Add Items
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor-list-items" // New path for List Items
                  className={`additems-sidebar-item ${activeTab === 'listItems' ? 'active' : ''}`}
                  onClick={() => handleSetActiveTab('listItems')}
                >
                  <img src={assets.list} alt="List Items Icon" className="sidebar-icon" /> List Items
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor-orders" // New path for Orders
                  className={`additems-sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => handleSetActiveTab('orders')}
                >
                  <img src={assets.orderr} alt="Orders Icon" className="sidebar-icon" /> Orders
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="additems-main-content">
          {/* Conditional rendering based on activeTab */}
          {activeTab === 'addItems' && (
            <form className="additems-form" onSubmit={handleAddClick}>
              {/* ... Add Items form JSX ... */}
              <div className="additems-form-section additems-upload-section">
                <label htmlFor="imageUpload" className="additems-upload-label">
                  Upload Image
                  <div className="additems-image-placeholder">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                    ) : (
                      <img src={assets.upload || ''} alt="Upload Placeholder" className="upload-placeholder-icon" />
                    )}
                  </div>
                </label>
                <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>
              <div className="additems-form-section">
                <label htmlFor="productName">Product name</label>
                <input type="text" id="productName" placeholder="Type here" value={productName} onChange={(e) => setProductName(e.target.value)} required />
              </div>
              <div className="additems-form-section">
                <label htmlFor="productDescription">Product Description</label>
                <textarea id="productDescription" placeholder="Write content here.." value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows="4" />
              </div>
              <div className="additems-form-row">
                <div className="additems-form-section additems-category-section">
                  <label id="productCategoryLabel">Product Category</label>
                  <div className="additems-custom-select">
                    <div id="productCategorySelect" className="additems-select-selected" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} role="combobox" aria-haspopup="listbox" aria-expanded={isCategoryDropdownOpen} aria-labelledby="productCategoryLabel" tabIndex="0" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsCategoryDropdownOpen(!isCategoryDropdownOpen); }}>
                      {productCategory}
                      <span className={`additems-select-arrow ${isCategoryDropdownOpen ? 'open' : ''}`}>&#9660;</span>
                    </div>
                    {isCategoryDropdownOpen && (
                      <div className="additems-select-options" role="listbox">
                        {categories.map((category) => (
                          <div key={category} className="additems-select-option" onClick={() => { setProductCategory(category); setIsCategoryDropdownOpen(false); }} role="option" aria-selected={productCategory === category} tabIndex="-1" >
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="additems-form-section additems-price-section">
                  <label htmlFor="productPrice">Product Price</label>
                  <div className="additems-price-input-wrapper">
                    <input type="number" id="productPrice" placeholder="Price (e.g., 25)" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} min="0" step="any" required />
                  </div>
                </div>
              </div>
              <button type="submit" className="additems-add-button">ADD</button>
            </form>
          )}

          {activeTab === 'listItems' && (
            <ListItems itemsList={itemsList} handleRemoveItem={handleRemoveItem} />
          )}

          {activeTab === 'orders' && (
            <Orderss orders={orders} orderStatuses={orderStatuses} handleStatusChange={handleStatusChange} />
          )}
        </main>
      </div>

      {showSuccessMessage && (<div className="additems-success-notification"> <CheckIcon /> Food Added Successfully </div>)}
    </div>
  );
};

export default AddItems;