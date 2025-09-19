# S3 Module - Internal Service

Este módulo proporciona servicios internos para manejar archivos en AWS S3. **S3Service debe usarse internamente en otros servicios, no exponerse directamente**.

## 🎯 Propósito

- **S3Service**: Servicio interno para operaciones con S3
- **Testing endpoints**: Para probar la funcionalidad de S3
- **Patrón de uso**: Ejemplo de cómo integrar S3Service en otros servicios

## 📁 Estructura

```
s3/
├── s3.service.ts      # Servicio interno de S3
├── s3.controller.ts    # Endpoints de testing
├── s3.module.ts       # Módulo de S3
├── helpers/           # Helpers para manejo de errores
└── README.md         # Esta documentación
```

## 🔧 Cómo usar S3Service internamente

### 1. Importar S3Module en tu módulo

```typescript
// tu-module.module.ts
import { Module } from '@nestjs/common'
import { S3Module } from '../s3/s3.module'

@Module({
  imports: [S3Module],  // Importar S3Module
  // ...
})
export class TuModule {}
```

### 2. Inyectar S3Service en tu servicio

```typescript
// tu-service.ts
import { Injectable } from '@nestjs/common'
import { S3Service } from '../s3/s3.service'

@Injectable()
export class TuService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(file: Buffer, filename: string): Promise<ResponseDto<string>> {
    const s3Key = `tu-categoria/${Date.now()}-${filename}`
    
    return this.s3Service.upload(s3Key, file, 'application/octet-stream')
  }
}
```

## 🚀 Ejemplos de implementación

### Para usuarios (avatares)

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private s3Service: S3Service
  ) {}

  async uploadAvatar(userId: string, file: Buffer): Promise<ResponseDto<string>> {
    const s3Key = `users/${userId}/avatar/${Date.now()}.jpg`
    
    const result = await this.s3Service.upload(s3Key, file, 'image/jpeg')
    
    if (result.success) {
      // Actualizar usuario con la URL del avatar
      await this.usersRepository.update(userId, { 
        avatarUrl: result.data 
      })
    }
    
    return result
  }
}
```

### Para productos (imágenes)

```typescript
// products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private s3Service: S3Service
  ) {}

  async uploadProductImage(productId: string, file: Buffer): Promise<ResponseDto<string>> {
    const s3Key = `products/${productId}/images/${Date.now()}.jpg`
    
    return this.s3Service.upload(s3Key, file, 'image/jpeg')
  }
}
```

### Para documentos

```typescript
// documents.service.ts
@Injectable()
export class DocumentsService {
  constructor(private s3Service: S3Service) {}

  async uploadDocument(file: Buffer, filename: string): Promise<ResponseDto<string>> {
    const s3Key = `documents/${Date.now()}-${filename}`
    
    return this.s3Service.upload(s3Key, file, 'application/pdf')
  }
}
```

## 🧪 Testing Endpoints

Los endpoints en `/testing/s3/*` son **solo para testing**:

- `POST /testing/s3/upload` - Subir archivo
- `GET /testing/s3/download/:filename` - Descargar archivo
- `GET /testing/s3/view/:filename` - Ver archivo
- `DELETE /testing/s3/delete/:filename` - Eliminar archivo
- `GET /testing/s3/url/:filename` - Obtener URL

## ⚠️ Importante

### ✅ Hacer:
- Usar S3Service internamente en otros servicios
- Importar S3Module en tu módulo
- Crear endpoints específicos según necesidades

### ❌ No hacer:
- Exponer endpoints S3 directamente
- Usar los endpoints de testing en producción
- Modificar S3Service sin necesidad

## 🔄 Patrón recomendado

1. **Importar S3Module** en tu módulo
2. **Inyectar S3Service** en tu servicio
3. **Crear métodos específicos** para tu caso de uso
4. **Exponer endpoints** específicos de tu dominio

## 📚 Referencias

- [S3Service](./s3.service.ts) - Servicio interno
- [Testing endpoints](./s3.controller.ts) - Endpoints de prueba
- [S3Module](./s3.module.ts) - Módulo de S3 