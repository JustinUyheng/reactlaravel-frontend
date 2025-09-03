import { useCart } from "../CartandOrder/CartContext";

/**
 * Custom hook for getting cart counts with real-time updates
 * @param {Object} options - Configuration options
 * @param {string} options.type - Type of items to count ('order', 'reserve', or null for all)
 * @param {number} options.storeId - Count items for specific store only
 * @returns {Object} Cart count information
 */
export const useCartCounter = (options = {}) => {
	const { getCartItemCount, getStoreItems, cart } = useCart();
	const { type = null, storeId = null } = options;

	// Get counts based on options
	const getCount = () => {
		if (storeId) {
			const storeItems = getStoreItems(storeId, type);
			return storeItems.reduce((sum, item) => sum + item.quantity, 0);
		}
		return getCartItemCount(type);
	};

	const totalCount = getCount();
	const orderCount = getCartItemCount("order");
	const reserveCount = getCartItemCount("reserve");

	// Get store-specific counts if storeId provided
	const storeOrderCount = storeId
		? getStoreItems(storeId, "order").reduce(
				(sum, item) => sum + item.quantity,
				0
			)
		: 0;
	const storeReserveCount = storeId
		? getStoreItems(storeId, "reserve").reduce(
				(sum, item) => sum + item.quantity,
				0
			)
		: 0;

	return {
		// Main count based on options
		count: totalCount,

		// Specific type counts
		orderCount,
		reserveCount,

		// Store-specific counts (if storeId provided)
		storeOrderCount,
		storeReserveCount,

		// Utility flags
		hasItems: totalCount > 0,
		hasOrders: orderCount > 0,
		hasReservations: reserveCount > 0,

		// Helper function to check if specific item is in cart
		isInCart: (productId, itemType = type || "order") => {
			const targetArray = cart[itemType] || [];
			return targetArray.some(
				(item) =>
					item.id === productId && (!storeId || item.store_id === storeId)
			);
		},
	};
};
