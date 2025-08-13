# Dynamic World Change Detection for Morelia, Michoacán

## Descripción

Este script de Google Earth Engine permite detectar cambios en el uso de suelo en municipios de Michoacán, México, con enfoque especial en Morelia. Utiliza los datos de Dynamic World para analizar cambios temporales en diferentes tipos de cobertura terrestre.

## Funcionalidades

### 🗺️ **Selección de Región**
- Dropdown con todos los municipios (ADM2) disponibles en Michoacán
- Filtrado automático usando límites administrativos FAO/GAUL
- Configuración predeterminada en Morelia si está disponible

### 📅 **Selección Temporal**
- Selector de año inicial (2017-2024)
- Selector de año final (2018-2024) 
- Análisis de cambios entre períodos seleccionados

### 🛰️ **Tipos de Cobertura**
Análisis disponible para 9 bandas de Dynamic World:
- `water` - Agua
- `trees` - Árboles
- `grass` - Pasto
- `flooded_vegetation` - Vegetación inundada
- `crops` - Cultivos
- `shrub_and_scrub` - Arbustos y matorrales
- `built` - Construcciones (predeterminado)
- `bare` - Suelo desnudo
- `snow_and_ice` - Nieve y hielo

### ⚙️ **Control de Sensibilidad**
- Slider de umbral de cambio (0.1 - 0.9)
- Valor predeterminado: 0.5
- Ajuste de sensibilidad para detectar cambios significativos

### 🎯 **Visualización Inteligente**
- Zoom automático adaptativo:
  - **Morelia**: Zoom nivel 11 (más cercano)
  - **Otros municipios**: Zoom nivel 10 (general)
- Centrado automático en la región seleccionada
- Visualización de cambios en escala rojo-blanco

## Cómo Usar

1. **Ejecutar** el script en Google Earth Engine Code Editor
2. **Seleccionar** el municipio de interés en el dropdown
3. **Configurar** el período de análisis (año inicial y final)
4. **Elegir** el tipo de cobertura a analizar
5. **Ajustar** el umbral de detección de cambios
6. **Hacer clic** en "Show Changes" para visualizar los resultados

## Datos Utilizados

- **Dynamic World V1**: Colección de imágenes de clasificación de uso de suelo
- **FAO/GAUL**: Límites administrativos simplificados (nivel ADM2)
- **Cobertura temporal**: 2017-2024
- **Resolución**: 10 metros

## Resultados

El mapa muestra en **rojo** las áreas donde se detectaron cambios significativos en el tipo de cobertura seleccionado entre los períodos especificados. Las áreas en **blanco** representan zonas sin cambios significativos.

## Casos de Uso

- Monitoreo de expansión urbana en Morelia
- Análisis de deforestación en municipios de Michoacán
- Seguimiento de cambios agrícolas
- Estudios de impacto ambiental
- Planificación territorial

---

*Desarrollado para el análisis de cambios de uso de suelo en Michoacán usando Google Earth Engine y datos de Dynamic World.*
