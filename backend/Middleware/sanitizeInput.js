// Global security middleware to whitelist fields and block dangerous keys
const sanitizeInput = (allowedFields = null) => {
  return (req, res, next) => {
    // Function to recursively clean objects
    const cleanObject = (obj) => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      
      const cleaned = {};
      
      for (const [key, value] of Object.entries(obj)) {
        // Block dangerous keys starting with $, __, or prototype pollution keys
        if (key.startsWith('$') || 
            key.startsWith('__') || 
            key === 'constructor' || 
            key === 'prototype') {
          console.warn(`Blocked dangerous key: ${key}`);
          continue; // Skip this key
        }
        
        // Recursively clean nested objects
        if (typeof value === 'object' && value !== null) {
          cleaned[key] = cleanObject(value);
        } else {
          cleaned[key] = value;
        }
      }
      
      return cleaned;
    };
    
    // Clean the request body
    if (req.body && typeof req.body === 'object') {
      req.body = cleanObject(req.body);
      
      // Apply field whitelisting if specified
      if (allowedFields && Array.isArray(allowedFields)) {
        const whitelisted = {};
        allowedFields.forEach(field => {
          if (req.body.hasOwnProperty(field)) {
            whitelisted[field] = req.body[field];
          }
        });
        req.body = whitelisted;
      }
    }
    
    // Clean query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = cleanObject(req.query);
    }
    
    next();
  };
};

export { sanitizeInput };