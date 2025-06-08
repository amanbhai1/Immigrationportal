import api from './api';

export interface ChecklistItem {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}



class ChecklistService {
  // Get checklist items for the logged-in user
  async getChecklistItems() {
    try {
      const response = await api.get('/immigration-files/checklist');
      return response.data;
    } catch (error) {
      console.error('Error fetching checklist items:', error);
      throw error;
    }
  }

  // Add new checklist item
  async addChecklistItem(fileId: string, item: Partial<ChecklistItem>) {
    try {
      const response = await api.post(`/immigration-files/${fileId}/checklist`, item);
      return response.data;
    } catch (error) {
      console.error('Error adding checklist item:', error);
      throw error;
    }
  }

  // Update checklist item
  async updateChecklistItem(fileId: string, itemId: string, updates: Partial<ChecklistItem>) {
    try {
      const response = await api.put(`/immigration-files/${fileId}/checklist/${itemId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating checklist item:', error);
      throw error;
    }
  }

  // Delete checklist item
  async deleteChecklistItem(fileId: string, itemId: string) {
    try {
      const response = await api.delete(`/immigration-files/${fileId}/checklist/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      throw error;
    }
  }

  // Toggle checklist item completion status
  async toggleChecklistItem(fileId: string, itemId: string, isCompleted: boolean) {
    try {
      const response = await api.put(`/immigration-files/${fileId}/checklist/${itemId}`, {
        isCompleted
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling checklist item:', error);
      throw error;
    }
  }

  // Upload document for immigration file
  async uploadDocument(fileId: string, file: File, title: string, description?: string, onProgress?: (percentage: number) => void) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      if (description) {
        formData.append('description', description);
      }

      const response = await api.post(`/immigration-files/${fileId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentage);
          }
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  // Get file type icon based on mime type
  getFileTypeIcon(fileType: string): string {
    if (!fileType) return '📄';
    
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('zip') || fileType.includes('compressed')) return '🗜️';
    
    return '📎';
  }

  // Format file size from bytes to human-readable format
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

const checklistService = new ChecklistService();
export default checklistService;