export enum ProductCodes {
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  PRODUCT_DELETED = 'PRODUCT_DELETED',
  PRODUCT_FOUND = 'PRODUCT_FOUND',
  PRODUCTS_FOUND = 'PRODUCTS_FOUND',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_ALREADY_EXISTS = 'PRODUCT_ALREADY_EXISTS',
  ERROR_CREATING_PRODUCT = 'ERROR_CREATING_PRODUCT',
  ERROR_UPDATING_PRODUCT = 'ERROR_UPDATING_PRODUCT',
  ERROR_DELETING_PRODUCT = 'ERROR_DELETING_PRODUCT',
  ERROR_FINDING_PRODUCT = 'ERROR_FINDING_PRODUCT',
  ERROR_FINDING_PRODUCTS = 'ERROR_FINDING_PRODUCTS',
  CATEGORY_CREATED = 'CATEGORY_CREATED',
  CATEGORY_ALREADY_EXISTS = 'CATEGORY_ALREADY_EXISTS',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  CATEGORY_DELETED = 'CATEGORY_DELETED'
}

export const ProductMessages: Record<ProductCodes, Record<string, string>> = {
  [ProductCodes.PRODUCT_CREATED]: {
    en: 'Product created successfully',
    es: 'Producto creado exitosamente'
  },
  [ProductCodes.PRODUCT_UPDATED]: {
    en: 'Product updated successfully',
    es: 'Producto actualizado exitosamente'
  },
  [ProductCodes.PRODUCT_DELETED]: {
    en: 'Product deleted successfully',
    es: 'Producto eliminado exitosamente'
  },
  [ProductCodes.PRODUCT_FOUND]: {
    en: 'Product found',
    es: 'Producto encontrado'
  },
  [ProductCodes.PRODUCTS_FOUND]: {
    en: 'Products found',
    es: 'Productos encontrados'
  },
  [ProductCodes.PRODUCT_NOT_FOUND]: {
    en: 'Product not found',
    es: 'Producto no encontrado'
  },
  [ProductCodes.PRODUCT_ALREADY_EXISTS]: {
    en: 'A product with this name already exists',
    es: 'Ya existe un producto con este nombre'
  },
  [ProductCodes.ERROR_CREATING_PRODUCT]: {
    en: 'Error creating product',
    es: 'Error al crear el producto'
  },
  [ProductCodes.ERROR_UPDATING_PRODUCT]: {
    en: 'Error updating product',
    es: 'Error al actualizar el producto'
  },
  [ProductCodes.ERROR_DELETING_PRODUCT]: {
    en: 'Error deleting product',
    es: 'Error al eliminar el producto'
  },
  [ProductCodes.ERROR_FINDING_PRODUCT]: {
    en: 'Error finding product',
    es: 'Error al buscar el producto'
  },
  [ProductCodes.ERROR_FINDING_PRODUCTS]: {
    en: 'Error finding products',
    es: 'Error al buscar los productos'
  },
  [ProductCodes.CATEGORY_CREATED]: {
    en: 'Category created successfully',
    es: 'Categoria creada exitosamente'
  },
  [ProductCodes.CATEGORY_ALREADY_EXISTS]: {
    en: 'Category already exists',
    es: 'Ya existe una categoria con este nombre'
  },
  [ProductCodes.CATEGORY_NOT_FOUND]: {
    en: 'Category not found',
    es: 'Categoria no encontrada'
  },
  [ProductCodes.CATEGORY_DELETED]: {
    en: 'Category deleted',
    es: 'Categoria eliminada exitosamente'
  }
}; 
