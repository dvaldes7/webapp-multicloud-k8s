Paso 3: Habilitar APIs necesarias

  Ahora necesitas activar los servicios que vas a
  usar:

  APIs que necesitas:

  1. Kubernetes Engine API (para GKE)
  2. Artifact Registry API (para subir imágenes)
  3. Compute Engine API (para las VMs del cluster)        

  Cómo habilitarlas:

  Opción A: Desde el menú
  1. Ve a "APIs & Services" > "Library"
  2. Busca cada API
  3. Click "Enable"

  Opción B: Desde Cloud Shell (más rápido)
  1. Click el ícono Cloud Shell (terminal) arriba
  derecha
  2. Ejecuta estos comandos:

  gcloud services enable container.googleapis.com
  gcloud services enable artifactregistry.googleapis.com
  gcloud services enable compute.googleapis.com



  
  🖱️ Pasos en la interfaz gráfica:

  1. Navegar a Kubernetes Engine:

  - En el menú lateral → "Kubernetes Engine"
  - Click "Clusters"

  2. Crear cluster:

  - Click "Create" (botón azul)
  - Selecciona "GKE Standard" (NO Autopilot)

  3. Configuración básica:

  - Nombre: my-webapp-cluster
  - Ubicación:
    - Selecciona "Zonal"
    - Zona: us-central1-a

  4. Configuración de nodos:

  - En "Node pools" → "default-pool"
  - Número de nodos: 3
  - Tipo de máquina: e2-micro
  - Tamaño de disco: 10 GB

  5. Crear:

  - Click "Create" al final

  ⏱️ Mientras se crea (3-5 minutos):al


  ● 🗂️ Paso 5: Configurar Artifact Registry

  1. Crear repositorio para tus imágenes:

  Opción A: Cloud Console
  1. Ve a "Artifact Registry" en el menú
  2. Click "Create Repository"
  3. Name: my-webapp-repo
  4. Format: Docker
  5. Location: us-central1 (misma región del cluster)
  6. Click "Create"

  Opción B: Cloud Shell
  gcloud artifacts repositories create my-webapp-repo \
    --repository-format=docker \
    --location=us-central1

  2. Configurar autenticación Docker:

  gcloud auth configure-docker us-central1-docker.pkg.dev

  🎯 Tu nueva imagen será:

  us-central1-docker.pkg.dev/TU-PROJECT-ID/my-webapp-repo/my-webapp:SHA        

  🔐 Paso 6: Crear Service Account para GitHub Actions

  Ahora necesitas una "identidad" que permita a GitHub Actions acceder a
  tu GCP.

  Crear Service Account:

  1. Ve a IAM & Admin:
  - Menú → "IAM & Admin" → "Service Accounts"

  2. Crear cuenta:
  - Click "Create Service Account"
  - Name: github-actions-sa
  - Description: Service account for GitHub Actions CI/CD
  - Click "Create and Continue"

  3. Asignar permisos:
  Necesita estos roles:
   - Artifact Registry Writer: Subir imágenes Docker
   -  Kubernetes Engine Developer: Hacer deployments
   -  Storage Admin: Acceso a almacenamiento del cluster

  4. Descargar clave JSON:
  - Click "Create Key"
  - Type: JSON
  - Se descargará un archivo .json

  ⚠️ MUY IMPORTANTE:

  ¡NO subas ese JSON a GitHub! Es como una contraseña. Lo usaremos como        
  secreto.
