import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  token?: string;
}

export class ApiClient {
  private instance: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      withCredentials: true,
      // ❌ NE PLUS mettre de headers par défaut ici
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 🎯 Request interceptor pour gérer FormData
    this.instance.interceptors.request.use(
      (config) => {
        // Si ce n'est PAS du FormData, ajouter Content-Type JSON
        if (!(config.data instanceof FormData)) {
          config.headers["Content-Type"] = "application/json";
        }
        // Si c'est FormData, ne rien faire (axios gère automatiquement)

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor pour logger les erreurs
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // Méthode upload simplifiée (optionnelle, car post() gère déjà FormData)
  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.instance.post<T>(url, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

// Instance singleton
let apiClientInstance: ApiClient | null = null;

export function initApiClient(config: ApiClientConfig): ApiClient {
  apiClientInstance = new ApiClient(config);
  return apiClientInstance;
}

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    throw new Error(
      "ApiClient non initialisé. Appelez initApiClient() d'abord."
    );
  }
  return apiClientInstance;
}
