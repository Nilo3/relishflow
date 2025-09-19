export enum UserCodes {
    USER_CREATED = 'USER_CREATED',
    USER_UPDATED = 'USER_UPDATED',
    USER_DELETED = 'USER_DELETED',
    USER_FOUND = 'USER_FOUND',
    USERS_FOUND = 'USERS_FOUND',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    ERROR_CREATING_USER = 'ERROR_CREATING_USER',
    ERROR_UPDATING_USER = 'ERROR_UPDATING_USER',
    ERROR_DELETING_USER = 'ERROR_DELETING_USER',
    ERROR_FINDING_USER = 'ERROR_FINDING_USER',
    ERROR_FINDING_USERS = 'ERROR_FINDING_USERS'
}

export const UserMessages: Record<UserCodes, Record<string, string>> = {
    [UserCodes.USER_CREATED]: {
        en: 'User created successfully',
        es: 'Usuario creado exitosamente'
    },
    [UserCodes.USER_UPDATED]: {
        en: 'User updated successfully',
        es: 'Usuario actualizado exitosamente'
    },
    [UserCodes.USER_DELETED]: {
        en: 'User deleted successfully',
        es: 'Usuario eliminado exitosamente'
    },
    [UserCodes.USER_FOUND]: {
        en: 'User found',
        es: 'Usuario encontrado'
    },
    [UserCodes.USERS_FOUND]: {
        en: 'Users found',
        es: 'Usuarios encontrados'
    },
    [UserCodes.USER_NOT_FOUND]: {
        en: 'User not found',
        es: 'Usuario no encontrado'
    },
    [UserCodes.USER_ALREADY_EXISTS]: {
        en: 'A user with this email already exists',
        es: 'Ya existe un usuario con este correo'
    },
    [UserCodes.ERROR_CREATING_USER]: {
        en: 'Error creating user',
        es: 'Error al crear el usuario'
    },
    [UserCodes.ERROR_UPDATING_USER]: {
        en: 'Error updating user',
        es: 'Error al actualizar el usuario'
    },
    [UserCodes.ERROR_DELETING_USER]: {
        en: 'Error deleting user',
        es: 'Error al eliminar el usuario'
    },
    [UserCodes.ERROR_FINDING_USER]: {
        en: 'Error finding user',
        es: 'Error al buscar el usuario'
    },
    [UserCodes.ERROR_FINDING_USERS]: {
        en: 'Error finding users',
        es: 'Error al buscar los usuarios'
    }
}; 