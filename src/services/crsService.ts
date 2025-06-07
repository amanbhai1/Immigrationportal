import api from './api';
import immigrationService from './immigrationService';

export interface CRSFormData {
  age: number;
  education: string;
  workExperience: number;
  englishListening: number;
  englishReading: number;
  englishWriting: number;
  englishSpeaking: number;
  provincialNomination: boolean;
  jobOffer: boolean;
  siblingInCanada: boolean;
  hasSpouse?: boolean;
  spouseEducation?: string;
  spouseWorkExperience?: number;
  spouseEnglishListening?: number;
  spouseEnglishReading?: number;
  spouseEnglishWriting?: number;
  spouseEnglishSpeaking?: number;
}

export interface CRSResponse {
  success: boolean;
  CRSScore: number;
  breakdown?: {
    coreFactors: number;
    spouseFactors: number;
    additionalPoints: number;
    total: number;
  };
  message?: string;
}

export interface CRSScoreData {
  currentScore: number;
  lastUpdated?: string;
  formData?: CRSFormData;
}

class CRSService {
  // Get current CRS score
  async getCurrentCRSScore(): Promise<CRSScoreData> {
    try {
      const response = await api.get('/crs');
      return response.data;
    } catch (error: any) {
      // If no immigration file found, return default values
      if (error.response?.status === 404) {
        return {
          currentScore: 0,
          lastUpdated: null,
          formData: null
        };
      }
      throw error;
    }
  }

  // Calculate and save CRS score
  async calculateAndSaveCRSScore(formData: CRSFormData): Promise<CRSResponse> {
    try {
    // First get all immigration files
    const response = await immigrationService.getImmigrationFiles();
    const immigrationFiles = response?.immigrationFiles;
    
    // Find the active immigration file
    const activeFile = immigrationFiles?.find(file => file.isActive);
    
    if (!activeFile) {
        // No active immigration file - calculate locally
        const localScore = this.calculateCRSScoreLocally(formData);
        const breakdown = this.getScoreBreakdown(formData);
        return {
          success: true,
          CRSScore: localScore,
          breakdown,
          message: 'Score calculated locally (no immigration file found)'
        };
      }
      // If we have an active file, save the CRS score and form data
    const saveResponse = await api.post('/crs', {
        ...formData,
      immigrationFileId: activeFile._id
      });
      // Update the immigration file's CRS score directly
    await api.put(`/immigration-files/${activeFile._id}/crs-score`, {
      CRSScore: saveResponse.data.CRSScore
      });
    return saveResponse.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 404 || error.response?.status === 401) {
        // Calculate locally if unauthorized or no file found
        const localScore = this.calculateCRSScoreLocally(formData);
        const breakdown = this.getScoreBreakdown(formData);
        return {
          success: true,
          CRSScore: localScore,
          breakdown,
          message: 'Score calculated locally (no immigration file found)'
        };
      }
      throw error;
    }
  }

  // Update CRS score
  async updateCRSScore(formData: CRSFormData): Promise<CRSResponse> {
    try {
      const response = await api.put('/crs', formData);
      return response.data;
    } catch (error: any) {
      // If no immigration file found, calculate locally and return
      if (error.response?.status === 404) {
        const localScore = this.calculateCRSScoreLocally(formData);
        const breakdown = this.getScoreBreakdown(formData);
        return {
          success: true,
          CRSScore: localScore,
          breakdown,
          message: 'Score calculated locally (no immigration file found)'
        };
      }
      throw error;
    }
  }

  // Calculate CRS score locally (for preview)
  calculateCRSScoreLocally(formData: CRSFormData): number {
    let totalScore = 0;

    // Age points (up to 110 points)
    if (formData.age >= 20 && formData.age <= 29) totalScore += 110;
    else if (formData.age >= 30 && formData.age <= 31) totalScore += 105;
    else if (formData.age >= 32 && formData.age <= 35) totalScore += 100;
    else if (formData.age >= 36 && formData.age <= 39) totalScore += 90;
    else if (formData.age >= 40 && formData.age <= 45) totalScore += 80;
    else if (formData.age >= 46 && formData.age <= 47) totalScore += 70;

    // Education points (up to 150 points)
    const educationPoints: Record<string, number> = {
      'secondary': 30,
      'certificate': 90,
      'diploma': 98,
      'bachelor': 120,
      'master': 135,
      'phd': 150,
    };
    totalScore += educationPoints[formData.education] || 0;

    // Language points (up to 136 points for English)
    const englishCLB = Math.min(
      Math.floor(formData.englishListening),
      Math.floor(formData.englishReading),
      Math.floor(formData.englishWriting),
      Math.floor(formData.englishSpeaking)
    );

    if (englishCLB >= 9) totalScore += 136;
    else if (englishCLB >= 8) totalScore += 124;
    else if (englishCLB >= 7) totalScore += 110;
    else if (englishCLB >= 6) totalScore += 88;
    else if (englishCLB >= 5) totalScore += 68;
    else if (englishCLB >= 4) totalScore += 32;

    // Work experience points (up to 80 points)
    if (formData.workExperience >= 6) totalScore += 80;
    else if (formData.workExperience >= 4) totalScore += 70;
    else if (formData.workExperience >= 2) totalScore += 60;
    else if (formData.workExperience >= 1) totalScore += 40;

    // Spouse factors (if applicable)
    if (formData.hasSpouse && formData.spouseEducation) {
      const spouseEducationPoints: Record<string, number> = {
        'secondary': 2,
        'certificate': 6,
        'diploma': 7,
        'bachelor': 8,
        'master': 10,
        'phd': 10,
      };
      totalScore += spouseEducationPoints[formData.spouseEducation] || 0;

      if (formData.spouseEnglishListening && formData.spouseEnglishReading && 
          formData.spouseEnglishWriting && formData.spouseEnglishSpeaking) {
        const spouseEnglishCLB = Math.min(
          Math.floor(formData.spouseEnglishListening),
          Math.floor(formData.spouseEnglishReading),
          Math.floor(formData.spouseEnglishWriting),
          Math.floor(formData.spouseEnglishSpeaking)
        );

        if (spouseEnglishCLB >= 9) totalScore += 20;
        else if (spouseEnglishCLB >= 7) totalScore += 16;
        else if (spouseEnglishCLB >= 5) totalScore += 8;
      }

      if (formData.spouseWorkExperience) {
        if (formData.spouseWorkExperience >= 5) totalScore += 10;
        else if (formData.spouseWorkExperience >= 3) totalScore += 8;
        else if (formData.spouseWorkExperience >= 1) totalScore += 5;
      }
    }

    // Additional points
    if (formData.jobOffer) totalScore += 50;
    if (formData.provincialNomination) totalScore += 600;
    if (formData.siblingInCanada) totalScore += 15;

    return Math.min(totalScore, 1200); // Cap at maximum possible score
  }

  // Get score breakdown
  getScoreBreakdown(formData: CRSFormData) {
    let coreFactors = 0;
    let spouseFactors = 0;
    let additionalPoints = 0;

    // Core factors calculation
    // Age
    if (formData.age >= 20 && formData.age <= 29) coreFactors += 110;
    else if (formData.age >= 30 && formData.age <= 31) coreFactors += 105;
    else if (formData.age >= 32 && formData.age <= 35) coreFactors += 100;
    else if (formData.age >= 36 && formData.age <= 39) coreFactors += 90;
    else if (formData.age >= 40 && formData.age <= 45) coreFactors += 80;
    else if (formData.age >= 46 && formData.age <= 47) coreFactors += 70;

    // Education
    const educationPoints: Record<string, number> = {
      'secondary': 30,
      'certificate': 90,
      'diploma': 98,
      'bachelor': 120,
      'master': 135,
      'phd': 150,
    };
    coreFactors += educationPoints[formData.education] || 0;

    // Language
    const englishCLB = Math.min(
      Math.floor(formData.englishListening),
      Math.floor(formData.englishReading),
      Math.floor(formData.englishWriting),
      Math.floor(formData.englishSpeaking)
    );

    if (englishCLB >= 9) coreFactors += 136;
    else if (englishCLB >= 8) coreFactors += 124;
    else if (englishCLB >= 7) coreFactors += 110;
    else if (englishCLB >= 6) coreFactors += 88;
    else if (englishCLB >= 5) coreFactors += 68;
    else if (englishCLB >= 4) coreFactors += 32;

    // Work experience
    if (formData.workExperience >= 6) coreFactors += 80;
    else if (formData.workExperience >= 4) coreFactors += 70;
    else if (formData.workExperience >= 2) coreFactors += 60;
    else if (formData.workExperience >= 1) coreFactors += 40;

    // Spouse factors
    if (formData.hasSpouse && formData.spouseEducation) {
      const spouseEducationPoints: Record<string, number> = {
        'secondary': 2,
        'certificate': 6,
        'diploma': 7,
        'bachelor': 8,
        'master': 10,
        'phd': 10,
      };
      spouseFactors += spouseEducationPoints[formData.spouseEducation] || 0;

      if (formData.spouseEnglishListening && formData.spouseEnglishReading && 
          formData.spouseEnglishWriting && formData.spouseEnglishSpeaking) {
        const spouseEnglishCLB = Math.min(
          Math.floor(formData.spouseEnglishListening),
          Math.floor(formData.spouseEnglishReading),
          Math.floor(formData.spouseEnglishWriting),
          Math.floor(formData.spouseEnglishSpeaking)
        );

        if (spouseEnglishCLB >= 9) spouseFactors += 20;
        else if (spouseEnglishCLB >= 7) spouseFactors += 16;
        else if (spouseEnglishCLB >= 5) spouseFactors += 8;
      }

      if (formData.spouseWorkExperience) {
        if (formData.spouseWorkExperience >= 5) spouseFactors += 10;
        else if (formData.spouseWorkExperience >= 3) spouseFactors += 8;
        else if (formData.spouseWorkExperience >= 1) spouseFactors += 5;
      }
    }

    // Additional points
    if (formData.jobOffer) additionalPoints += 50;
    if (formData.provincialNomination) additionalPoints += 600;
    if (formData.siblingInCanada) additionalPoints += 15;

    const total = coreFactors + spouseFactors + additionalPoints;

    return {
      coreFactors,
      spouseFactors,
      additionalPoints,
      total: Math.min(total, 1200)
    };
  }
}

const crsService = new CRSService();
export default crsService;