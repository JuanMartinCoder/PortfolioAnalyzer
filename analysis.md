# Especificación de Requisitos y Análisis de Sistema
## Plataforma de Análisis Cuantitativo de Portafolios (Quant Engine MVP)

---

### Información del Proyecto

* **Nombre del Proyecto:** Quant Engine MVP
* **Integrantes:** Juan Martin Rodriguez
* **Fecha de Creación:** 21 de Septiembre, 2026
* **Estado:** Fase de Análisis y Especificación de Requisitos
* **Versión:** 1.0.0

---

### Abstract

**Quant Engine MVP** es una plataforma web orientada al análisis cuantitativo de portafolios financieros. La aplicación permite a analistas e inversores evaluar el rendimiento y el riesgo de una estrategia financiera a través de la carga de una serie temporal de retornos en formato CSV. 

Diseñada bajo un enfoque *stateless* e independiente de persistencia, la plataforma realiza el parseo de datos y el cálculo de 6 indicadores financieros fundamentales (*Total Return*, *Annualized Return*, *Annualized Volatility*, *Sharpe Ratio*, *Sortino Ratio* y *Max Drawdown*) de forma inmediata en memoria. La arquitectura desacopla estrictamente el frontend (interfaz interactiva para carga y visualización de métricas) del backend (motor numérico expuesto vía API REST).

---

## 1. Requisitos del Sistema

### 1.1. Requisitos Funcionales (RF)

* **RF-01: Carga de archivo CSV**
  * El sistema debe permitir al usuario subir un archivo de serie temporal en formato `.csv` a través de un componente dedicado en la interfaz web.

* **RF-02: Validación de Entrada**
  * **RF-02.1 (Cliente):** El frontend debe validar la extensión `.csv` y limitar el tamaño máximo a 5 MB.
  * **RF-02.2 (Servidor):** El backend debe validar la existencia y legibilidad de los encabezados obligatorios (`Date` y `Return`) y comprobar la validez numérica de los registros.

* **RF-03: Procesamiento y Cálculo de Indicadores**
  * El sistema debe calcular en memoria los siguientes indicadores de rendimiento y riesgo:
    1. **Total Return (Rendimiento Acumulado):** $\prod (1 + R_t) - 1$
    2. **Annualized Return (Rendimiento Anualizado):** Rendimiento geométrico ajustado a un año bursátil (252 días).
    3. **Annualized Volatility (Volatilidad Anualizada):** Desviación estándar de los retornos ajustada a 252 días ($\sigma_{\text{diaria}} \times \sqrt{252}$).
    4. **Sharpe Ratio:** Relación de retorno excedentario respecto a la volatilidad total ($(R_p - R_f) / \sigma_p$).
    5. **Sortino Ratio:** Relación de retorno excedentario respecto al riesgo de caída (desviación a la baja).
    6. **Max Drawdown (MDD):** La mayor pérdida porcentual acumulada desde un pico hasta un valle.

* **RF-04: Presentación de Resultados**
  * El sistema debe mostrar un resumen operativo (cantidad de registros procesados, fecha de inicio y fecha de fin).
  * El sistema debe presentar cada indicador en tarjetas de métricas visuales con formato numérico adecuado (porcentajes con 2 decimales, ratios con 2-3 decimales) y código de colores según el desempeño (positivo/negativo).

* **RF-05: Manejo y Gestión de Errores**
  * El sistema debe informar al usuario mediante mensajes descriptivos si el archivo contiene datos inconsistentes, fechas desordenadas, campos vacíos o valores no numéricos.

---

### 1.2. Requisitos No Funcionales (RNF)

* **RNF-01: Rendimiento / Tiempo de Respuesta**
  * El tiempo total de procesamiento y respuesta de la API REST para archivos de hasta 5.000 registros (~20 años de datos diarios) no debe superar los **500 ms**.

* **RNF-02: Sin Estado (Stateless)**
  * El backend no almacenará los archivos CSV ni persistirá las métricas calculadas en bases de datos o almacenamiento en disco. Todo procesamiento debe ocurrir estrictamente en RAM.

* **RNF-03: Desacoplamiento y Modularidad**
  * El Frontend y el Backend deben permanecer totalmente desacoplados, comunicándose mediante una API REST estándar con soporte para CORS (Cross-Origin Resource Sharing).

* **RNF-04: Experiencia de Usuario (UX)**
  * La interfaz web debe proveer feedback inmediato durante el proceso de carga y análisis (estados de carga/spinner, notificaciones tipo Toast para errores).

---

## 2. Casos de Uso

### CU-01: Analizar Serie Temporal de Retornos

* **Actor Principal:** Usuario / Analista Web.
* **Precondiciones:** El usuario dispone de un archivo `.csv` válido con las columnas `Date` y `Return`.
* **Postcondición:** Se presentan en el dashboard las métricas calculadas y el resumen del archivo analizado.

#### Flujo Principal
1. El usuario accede a la plataforma web.
2. El usuario arrastra o selecciona el archivo CSV en el área de carga (*Dropzone*).
3. El frontend valida que el archivo posea formato `.csv` y no exceda 5 MB.
4. El frontend realiza una petición HTTP `POST` a `/api/v1/portfolio/analyze` enviando el archivo en formato `multipart/form-data`.
5. El backend recibe la petición, parsea la estructura del CSV y carga la serie temporal en memoria.
6. El backend calcula los 6 indicadores financieros definidos en **RF-03**.
7. El backend responde con un código HTTP `200 OK` y el payload JSON con los indicadores.
8. El frontend procesa el JSON y renderiza las tarjetas de métricas en la interfaz.

#### Flujos Alternativos

* **3a. Validación fallida en el cliente (Formato / Tamaño):**
  1. El frontend detecta un tipo de archivo o tamaño no permitido.
  2. Muestra un mensaje de advertencia: *"El archivo debe ser un CSV y pesar menos de 5 MB."*
  3. Finaliza el caso de uso.

* **5a. Estructura de CSV o formato numérico inválido:**
  1. El backend detecta errores de parseo (columna faltante o valores no numéricos).
  2. El backend responde con un código HTTP `400 Bad Request`:
     ```json
     {
       "status": 400,
       "error": "BAD_REQUEST",
       "message": "Formato de CSV inválido: La columna 'Return' en la fila 12 no contiene un valor numérico."
     }
     ```
  3. El frontend muestra la alerta de error devuelta por la API.
  4. Finaliza el caso de uso.

* **5b. Registros insuficientes para el análisis:**
  1. El backend detecta que la serie temporal tiene menos de 2 registros numéricos válidos.
  2. El backend responde con un código HTTP `422 Unprocessable Entity`:
     ```json
     {
       "status": 422,
       "error": "INSUFFICIENT_DATA",
       "message": "Se requieren al menos 2 registros de retornos para calcular métricas de riesgo."
     }
     ```
  3. El frontend notifica al usuario el motivo del fallo.
  4. Finaliza el caso de uso.

---

## 3. Diseño del Sistema (Reservado)

> *Esta sección se completará en las siguientes etapas del proyecto.*

### 3.1. Arquitectura General y Stack Tecnológico
* **Frontend:** React (Vite) + Tailwind CSS
* **Backend:** [A definir: Go vs Java]
* **Contrato de API:** `POST /api/v1/portfolio/analyze`

### 3.2. Diagramas de Secuencia
* *Próximo paso: Definición del flujo de datos entre cliente, endpoint HTTP y servicios de cálculo.*

### 3.3. Estructura de Clases / Paquetes del Backend
* *Próximo paso: Definición de DTOs, Handlers/Controllers y Motores de Cálculo.*

