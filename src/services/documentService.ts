import api from './api';

export interface Document {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  uploadedAt: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class DocumentService {
  // Upload a document
  async uploadDocument(
    immigrationFileId: string, 
    file: File, 
    title: string, 
    description?: string,
    onProgress?: (progress: UploadProgress) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }

    const response = await api.post(
      `/immigration-files/${immigrationFileId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            };
            onProgress(progress);
          }
        },
      }
    );

    return response.data;
  }

  // Get documents for an immigration file
  async getDocuments(immigrationFileId: string) {
    const response = await api.get(`/immigration-files/${immigrationFileId}/documents`);
    return response.data;
  }

  // Delete a document
  async deleteDocument(immigrationFileId: string, documentId: string) {
    const response = await api.delete(`/immigration-files/${immigrationFileId}/documents/${documentId}`);
    return response.data;
  }

  // Download a document
  async downloadDocument(fileUrl: string) {
    const response = await api.get(fileUrl, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Validate file type and size
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 10MB',
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported. Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG files.',
      };
    }

    return { isValid: true };
  }

  // Get file type icon
  getFileTypeIcon(fileType: string): string {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📎';
  }

  // Get predefined document types
  getPredefinedDocuments() {
    return [
      {
        id: 'passport',
        name: 'Passport',
        description: 'Valid passport with at least 6 months remaining validity',
        category: 'Identity',
        required: true,
        icon: '🛂'
      },
      {
        id: 'eca',
        name: 'Educational Credential Assessment (ECA)',
        description: 'Educational credentials evaluated by designated organization',
        category: 'Education',
        required: true,
        icon: '🎓'
      },
      {
        id: 'language-test',
        name: 'Language Test Results',
        description: 'IELTS, CELPIP, or other approved language test results',
        category: 'Language',
        required: true,
        icon: '🗣️'
      },
      {
        id: 'work-experience',
        name: 'Work Experience Letters',
        description: 'Reference letters from current and previous employers',
        category: 'Employment',
        required: true,
        icon: '💼'
      },
      {
        id: 'police-clearance',
        name: 'Police Clearance Certificate',
        description: 'Police clearance from country of residence and nationality',
        category: 'Background',
        required: true,
        icon: '🚔'
      },
      {
        id: 'medical-exam',
        name: 'Medical Examination',
        description: 'Medical examination by panel physician',
        category: 'Medical',
        required: true,
        icon: '🏥'
      },
      {
        id: 'proof-of-funds',
        name: 'Proof of Funds',
        description: 'Bank statements showing settlement funds',
        category: 'Financial',
        required: true,
        icon: '💰'
      },
      {
        id: 'birth-certificate',
        name: 'Birth Certificate',
        description: 'Official birth certificate with translation if applicable',
        category: 'Identity',
        required: true,
        icon: '📋'
      },
      {
        id: 'marriage-certificate',
        name: 'Marriage Certificate',
        description: 'Marriage certificate if applicable',
        category: 'Family',
        required: false,
        icon: '💒'
      },
      {
        id: 'job-offer',
        name: 'Job Offer Letter',
        description: 'Valid job offer from Canadian employer (if applicable)',
        category: 'Employment',
        required: false,
        icon: '📝'
      },
      {
        id: 'provincial-nomination',
        name: 'Provincial Nomination Certificate',
        description: 'Provincial nomination certificate (if applicable)',
        category: 'Immigration',
        required: false,
        icon: '🏛️'
      },
      {
        id: 'other',
        name: 'Other Supporting Documents',
        description: 'Any other supporting documents for your application',
        category: 'Other',
        required: false,
        icon: '📎'
      }
    ];
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

const documentService = new DocumentService();
export default documentService;