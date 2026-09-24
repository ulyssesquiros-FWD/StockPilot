/**
 * StockPilot Validation Utility Functions
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  // Minimum 6 characters with at least one letter and one number or special char
  return password.length >= 6;
}

export function validateProductForm(data) {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'El nombre del producto es obligatorio.';
  }

  if (!data.sku || !data.sku.trim()) {
    errors.sku = 'El código SKU es obligatorio.';
  }

  if (!data.categoryId) {
    errors.categoryId = 'Debe seleccionar una categoría.';
  }

  const purchasePrice = Number(data.purchasePrice);
  if (isNaN(purchasePrice) || purchasePrice < 0) {
    errors.purchasePrice = 'El precio de compra debe ser un número válido mayor o igual a cero.';
  }

  const salePrice = Number(data.salePrice);
  if (isNaN(salePrice) || salePrice <= 0) {
    errors.salePrice = 'El precio de venta debe ser un número mayor a cero.';
  }

  const stock = Number(data.stock);
  if (isNaN(stock) || stock < 0) {
    errors.stock = 'Las existencias no pueden ser un valor negativo.';
  }

  const minimumStock = Number(data.minimumStock);
  if (isNaN(minimumStock) || minimumStock < 0) {
    errors.minimumStock = 'El stock mínimo no puede ser negativo.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateMovementForm(data, currentProductStock = 0) {
  const errors = {};

  if (!data.productId) {
    errors.productId = 'Debe seleccionar un producto.';
  }

  if (!data.type) {
    errors.type = 'Debe seleccionar el tipo de movimiento.';
  }

  const qty = Number(data.quantity);
  if (isNaN(qty) || qty <= 0) {
    errors.quantity = 'La cantidad debe ser un número mayor a cero.';
  } else if (data.type === 'EXIT' && qty > currentProductStock) {
    errors.quantity = `No hay suficiente stock (${currentProductStock} disponibles) para realizar una salida de ${qty}.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
