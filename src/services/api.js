// API service for cucumber disease detection
import { API_BASE_URL } from '../config/api'

export const apiService = {
  // Upload and process image
  async detectDisease(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const response = await fetch(`${API_BASE_URL}/detect`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Detection error:', error);
      throw error;
    }
  },
  
  // Check model status
  async checkModelStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/model/status`);
      return await response.json();
    } catch (error) {
      console.error('Model status error:', error);
      throw error;
    }
  },
  
  // Upload training dataset
  async uploadDataset(files, className) {
    const formData = new FormData();
    formData.append('class_name', className);
    
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload/dataset`, {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
  
  // Get processing history
  async getHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      return await response.json();
    } catch (error) {
      console.error('History error:', error);
      throw error;
    }
  }
  
};
