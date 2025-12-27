
module.exports = class MIDDLEWARES {
 
// Create date and add 1 hour
static date_created() {

  const now = new Date();
  
  now.setHours(now.getHours() + 1); // Add 1 hour
  
  return now.toISOString().slice(0, 19).replace('T', ' ');

}

// Creates Confirmation Pin for Orders
static generateConfirmationPin() {
  
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit PIN

}

// Check Stock Availability
static stock_availability(products) {

  let out_of_stock = "";

  let slightly_available = "";

  const result = products.filter(item =>
    
    item.quantity > item.stock_quantity
  
  );

  if (result.length === 0) {
    
    return null; // no problem
  
  }

  result.forEach(item => {
    
    if (item.stock_quantity === 0) {
      
      out_of_stock += `${item.name}, `;
    
    } else {
      
      slightly_available += `${item.name}, `;
    
    }
  
  });

  let message = "";

  if (out_of_stock) {
    
    message += out_of_stock + "are out of stock. ";
  
  }

  if (slightly_available) {
    
    message += slightly_available + "available but not in this quantity.";
  
  }

  return message;

}


}
