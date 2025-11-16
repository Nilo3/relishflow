export enum RestaurantCodes {
  RESTAURANT_CREATED = 'RESTAURANT_CREATED',
  RESTAURANT_CREATED_WITHOUT_LOGO = 'RESTAURANT_CREATED_WITHOUT_LOGO',
  RESTAURANT_TABLE_CREATED = 'RESTAURANT_TABLE_CREATED',
  RESTAURANT_TABLE_CREATED_WITHOUT_QR = 'RESTAURANT_TABLE_CREATED_WITHOUT_QR',
  SCHEDULE_CREATED = 'SCHEDULE_CREATED',
  SCHEDULES_FOUND = 'SCHEDULES_FOUND',
  SCHEDULES_NOT_FOUND = 'SCHEDULES_NOT_FOUND',
  INVALID_SCHEDULE_FORMAT = 'INVALID_SCHEDULE_FORMAT',
  SCHEDULE_OVERLAP = 'SCHEDULE_OVERLAP',
  SCHEDULE_ALREADY_EXISTS = 'SCHEDULE_ALREADY_EXISTS',
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
  ERROR_FINDING_RESTAURANTS = 'ERROR_FINDING_RESTAURANTS',
  ERROR_CREATING_RESTAURANT_TABLE = 'ERROR_CREATING_RESTAURANT_TABLE',
  STAFF_CREATED = 'STAFF_CREATED',
  STAFFS_FOUND = 'STAFFS_FOUND',
  STAFFS_NOT_FOUND = 'STAFFS_NOT_FOUND',
  STAFF_ALREADY_EXISTS = 'STAFF_ALREADY_EXISTS',
  ERROR_CREATING_STAFF = 'ERROR_CREATING_STAFF',
  RESTAURANT_TABLES_NOT_FOUND = 'RESTAURANT_TABLES_NOT_FOUND',
  RESTAURANT_TABLES_FOUND = 'RESTAURANT_TABLES_FOUND',
  RESTAURANT_TABLE_NOT_FOUND = 'RESTAURANT_TABLE_NOT_FOUND',
  RESTAURANT_TABLE_FOUND = 'RESTAURANT_TABLE_FOUND',
  RESTAURANT_TABLE_UPDATED = 'RESTAURANT_TABLE_UPDATED',
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
  [RestaurantCodes.RESTAURANT_TABLE_CREATED]: {
    en: 'Restaurant table created successfully',
    es: 'Mesa del restaurante creada exitosamente'
  },
  [RestaurantCodes.RESTAURANT_TABLE_CREATED_WITHOUT_QR]: {
    en: 'Restaurant table created successfully but QR code upload failed',
    es: 'Mesa del restaurante creada exitosamente pero falló la subida del código QR'
  },
  [RestaurantCodes.INVALID_SCHEDULE_FORMAT]: {
    en: 'Invalid schedule time format. Use HH:mm format (00:00-23:59)',
    es: 'Formato de hora inválido. Use el formato HH:mm (00:00-23:59)'
  },
  [RestaurantCodes.SCHEDULE_OVERLAP]: {
    en: 'Schedule overlaps with an existing schedule for this day',
    es: 'El horario se solapa con un horario existente para este día'
  },
  [RestaurantCodes.SCHEDULE_ALREADY_EXISTS]: {
    en: 'This schedule already exists for this day',
    es: 'Este horario ya existe para este día'
  },
  [RestaurantCodes.SCHEDULE_CREATED]: {
    en: 'Schedule created successfully',
    es: 'Horario creado exitosamente'
  },
  [RestaurantCodes.SCHEDULES_FOUND]: {
    en: 'Schedules found for this restaurant',
    es: 'Horarios encontrados para este restaurante'
  },
  [RestaurantCodes.SCHEDULES_NOT_FOUND]: {
    en: 'No schedules found for this restaurant',
    es: 'No se encontraron horarios para este restaurante'
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
  },
  [RestaurantCodes.ERROR_CREATING_RESTAURANT_TABLE]: {
    en: 'Error creating restaurant table',
    es: 'Error al crear la mesa del restaurante'
  },
  [RestaurantCodes.STAFF_CREATED]: {
    en: 'Staff member created successfully',
    es: 'Miembro del personal creado exitosamente'
  },
  [RestaurantCodes.STAFFS_FOUND]: {
    en: 'Staff members found',
    es: 'Miembros del personal encontrados'
  },
  [RestaurantCodes.STAFFS_NOT_FOUND]: {
    en: 'No staff members found for this restaurant',
    es: 'No se encontraron miembros del personal para este restaurante'
  },
  [RestaurantCodes.STAFF_ALREADY_EXISTS]: {
    en: 'A staff member with this email already exists',
    es: 'Ya existe un miembro del personal con este correo electrónico'
  },
  [RestaurantCodes.ERROR_CREATING_STAFF]: {
    en: 'Error creating staff member',
    es: 'Error al crear el miembro del personal'
  },
  [RestaurantCodes.RESTAURANT_TABLES_NOT_FOUND]: {
    en: 'No tables found for this restaurant',
    es: 'No se encontraron mesas para este restaurante'
  },
  [RestaurantCodes.RESTAURANT_TABLES_FOUND]: {
    en: 'Restaurant tables found',
    es: 'Mesas del restaurante encontradas'
  },
  [RestaurantCodes.RESTAURANT_TABLE_NOT_FOUND]: {
    en: 'Restaurant table not found',
    es: 'Mesa del restaurante no encontrada'
  },
  [RestaurantCodes.RESTAURANT_TABLE_FOUND]: {
    en: 'Restaurant table found',
    es: 'Mesa del restaurante encontrada'
  },
  [RestaurantCodes.RESTAURANT_TABLE_UPDATED]: {
    en: 'Restaurant table updated successfully',
    es: 'Mesa del restaurante actualizada exitosamente'
  }
}