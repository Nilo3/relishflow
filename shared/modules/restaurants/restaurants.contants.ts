export enum RestaurantCodes {
  RESTAURANT_CREATED = 'RESTAURANT_CREATED',
  RESTAURANT_CREATED_WITHOUT_LOGO = 'RESTAURANT_CREATED_WITHOUT_LOGO',
  RESTAURANT_UPDATED = 'RESTAURANT_UPDATED',
  RESTAURANT_UPDATED_WITHOUT_LOGO = 'RESTAURANT_UPDATED_WITHOUT_LOGO',
  RESTAURANT_DELETED = 'RESTAURANT_DELETED',
  RESTAURANT_FOUND = 'RESTAURANT_FOUND',
  RESTAURANTS_FOUND = 'RESTAURANTS_FOUND',
  RESTAURANT_NOT_FOUND = 'RESTAURANT_NOT_FOUND',
  RESTAURANT_ALREADY_EXISTS = 'RESTAURANT_ALREADY_EXISTS',
  ERROR_CREATING_RESTAURANT = 'ERROR_CREATING_RESTAURANT',
  ERROR_UPLOADING_LOGO = 'ERROR_UPLOADING_LOGO',
  ERROR_UPDATING_RESTAURANT = 'ERROR_UPDATING_RESTAURANT',
  ERROR_DELETING_RESTAURANT = 'ERROR_DELETING_RESTAURANT',
  ERROR_FINDING_RESTAURANT = 'ERROR_FINDING_RESTAURANT',
  ERROR_FINDING_RESTAURANTS = 'ERROR_FINDING_RESTAURANTS'
}

export const RestaurantMessages: Record<RestaurantCodes, Record<string, string>> = {
  [RestaurantCodes.RESTAURANT_CREATED]: {
    en: 'Restaurant created successfully',
    es: 'Restaurante creado exitosamente'
  },
  [RestaurantCodes.RESTAURANT_CREATED_WITHOUT_LOGO]: {
    en: 'Restaurant created successfully but logo upload failed',
    es: 'Restaurante creado exitosamente pero falló la subida del logo'
  },
  [RestaurantCodes.RESTAURANT_UPDATED]: {
    en: 'Restaurant updated successfully',
    es: 'Restaurante actualizado exitosamente'
  },
  [RestaurantCodes.RESTAURANT_UPDATED_WITHOUT_LOGO]: {
    en: 'Restaurant updated successfully but logo upload failed',
    es: 'Restaurante actualizado exitosamente pero falló la subida del logo'
  },
  [RestaurantCodes.RESTAURANT_DELETED]: {
    en: 'Restaurant deleted successfully',
    es: 'Restaurante eliminado exitosamente'
  },
  [RestaurantCodes.RESTAURANT_FOUND]: {
    en: 'Restaurant found',
    es: 'Restaurante encontrado'
  },
  [RestaurantCodes.RESTAURANTS_FOUND]: {
    en: 'Restaurants found',
    es: 'Restaurantes encontrados'
  },
  [RestaurantCodes.RESTAURANT_NOT_FOUND]: {
    en: 'Restaurant not found',
    es: 'Restaurante no encontrado'
  },        
    [RestaurantCodes.RESTAURANT_ALREADY_EXISTS]: {
    en: 'A restaurant with this name already exists',
    es: 'Ya existe un restaurante con este nombre'
  },
  [RestaurantCodes.ERROR_CREATING_RESTAURANT]: {
    en: 'Error creating restaurant',
    es: 'Error al crear el restaurante'
  },
  [RestaurantCodes.ERROR_UPDATING_RESTAURANT]: {
    en: 'Error updating restaurant',
    es: 'Error al actualizar el restaurante'
  },
  [RestaurantCodes.ERROR_UPLOADING_LOGO]: {
    en: 'Error uploading restaurant logo',
    es: 'Error al subir el logo del restaurante'
  },
  [RestaurantCodes.ERROR_DELETING_RESTAURANT]: {
    en: 'Error deleting restaurant',
    es: 'Error al eliminar el restaurante'
  },
  [RestaurantCodes.ERROR_FINDING_RESTAURANT]: {
    en: 'Error finding restaurant',
    es: 'Error al buscar el restaurante'
  },
  [RestaurantCodes.ERROR_FINDING_RESTAURANTS]: {
    en: 'Error finding restaurants',
    es: 'Error al buscar los restaurantes'
  }
}