import api from './api';

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  maritalStatus?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface Education {
  highestEducation?: string;
  fieldOfStudy?: string;
  institution?: string;
  graduationYear?: string;
}

export interface WorkExperience {
  currentJob?: string;
  employer?: string;
  workExperience?: string;
}

export interface LanguageProficiency {
  englishListening?: number;
  englishReading?: number;
  englishWriting?: number;
  englishSpeaking?: number;
  frenchListening?: number;
  frenchReading?: number;
  frenchWriting?: number;
  frenchSpeaking?: number;
}

export interface ChecklistItem {
  _id?: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  _id?: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  uploadedAt?: string;
}

export interface ImmigrationFile {
  _id: string;
  userId: string;
  fileNumber: string;
  category: string;
  personalInfo?: PersonalInfo;
  contactInfo?: ContactInfo;
  education?: Education;
  workExperience?: WorkExperience;
  languageProficiency?: LanguageProficiency;
  CRSScore: number;
  status: string;
  submissionDate?: string;
  decisionDate?: string;
  checklist: ChecklistItem[];
  documents: Document[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImmigrationFileData {
  fileNumber: string;
  category: string;
  CRSScore?: number;
  status?: string;
  notes?: string;
}

export interface UpdateProfileData {
  personalInfo?: PersonalInfo;
  contactInfo?: ContactInfo;
  education?: Education;
  workExperience?: WorkExperience;
  languageProficiency?: LanguageProficiency;
}

class ImmigrationService {
  // Get all immigration files
  async getImmigrationFiles() {
    const response = await api.get('/immigration-files');
    return response.data;
  }

  // Get active immigration file
  async getActiveImmigrationFile() {
    const response = await api.get('/immigration-files/active');
    return response.data;
  }

  // Get immigration file by ID
  async getImmigrationFileById(id: string) {
    const response = await api.get(`/immigration-files/${id}`);
    return response.data;
  }

  // Create new immigration file
  async createImmigrationFile(data: CreateImmigrationFileData) {
    const response = await api.post('/immigration-files', data);
    return response.data;
  }

  // Update immigration file
  async updateImmigrationFile(id: string, data: Partial<ImmigrationFile>) {
    const response = await api.put(`/immigration-files/${id}`, data);
    return response.data;
  }

  // Update immigration profile
  async updateImmigrationProfile(id: string, profileData: UpdateProfileData) {
    const response = await api.put(`/immigration-files/${id}/profile`, profileData);
    return response.data;
  }

  // Update CRS Score
  async updateCRSScore(id: string, crsScore: number) {
    const response = await api.put(`/immigration-files/${id}/crs-score`, { CRSScore: crsScore });
    return response.data;
  }

  // Delete immigration file
  async deleteImmigrationFile(id: string) {
    const response = await api.delete(`/immigration-files/${id}`);
    return response.data;
  }

  // Checklist operations
  async addChecklistItem(id: string, item: Omit<ChecklistItem, '_id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post(`/immigration-files/${id}/checklist`, item);
    return response.data;
  }

  async updateChecklistItem(id: string, itemId: string, item: Partial<ChecklistItem>) {
    const response = await api.put(`/immigration-files/${id}/checklist/${itemId}`, item);
    return response.data;
  }

  async deleteChecklistItem(id: string, itemId: string) {
    const response = await api.delete(`/immigration-files/${id}/checklist/${itemId}`);
    return response.data;
  }

  // Document operations
  async uploadDocument(id: string, formData: FormData) {
    const response = await api.post(`/immigration-files/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteDocument(id: string, documentId: string) {
    const response = await api.delete(`/immigration-files/${id}/documents/${documentId}`);
    return response.data;
  }
}

const immigrationService = new ImmigrationService();
export default immigrationService;