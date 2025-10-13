export enum MenuCodes {
  MENU_CREATED = 'MENU_CREATED',
  MENU_UPDATED = 'MENU_UPDATED',
  MENU_FOUND = 'MENU_FOUND',
  MENU_NOT_FOUND = 'MENU_NOT_FOUND',
  MENU_ACTIVE_NOT_FOUND = 'MENU_ACTIVE_NOT_FOUND',
  MENU_RESTAURANT_NOT_OWNED = 'MENU_RESTAURANT_NOT_OWNED',
  MENU_PRODUCTS_NOT_FOUND = 'MENU_PRODUCTS_NOT_FOUND',
  MENU_NOT_OWNED = 'MENU_NOT_OWNED'
}

export const MenuMessages: Record<MenuCodes, Record<string, string>> = {
  [MenuCodes.MENU_CREATED]: {
    en: 'Menu created successfully',
    es: 'Menú creado exitosamente'
  },
  [MenuCodes.MENU_UPDATED]: {
    en: 'Menu updated successfully',
    es: 'Menú actualizado exitosamente'
  },
  [MenuCodes.MENU_FOUND]: {
    en: 'Active menu found',
    es: 'Menú activo encontrado'
  },
  [MenuCodes.MENU_NOT_FOUND]: {
    en: 'Menu not found',
    es: 'Menú no encontrado'
  },
  [MenuCodes.MENU_ACTIVE_NOT_FOUND]: {
    en: 'No active menu found for this restaurant',
    es: 'No se encontró un menú activo para este restaurante'
  },
  [MenuCodes.MENU_RESTAURANT_NOT_OWNED]: {
    en: 'Restaurant does not exist or is not owned by the user',
    es: 'El restaurante no existe o no pertenece al usuario'
  },
  [MenuCodes.MENU_PRODUCTS_NOT_FOUND]: {
    en: 'Some products were not found for this restaurant',
    es: 'Algunos productos no se encontraron para este restaurante'
  },
  [MenuCodes.MENU_NOT_OWNED]: {
    en: 'Menu is not owned by this user',
    es: 'El menú no pertenece a este usuario'
  }
}


