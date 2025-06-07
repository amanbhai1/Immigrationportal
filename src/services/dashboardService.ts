import api from './api';
import immigrationService from './immigrationService';

export interface DashboardStats {
  totalFiles: number;
  completedTasks: number;
  pendingTasks: number;
  totalDocuments: number;
  applicationProgress: number;
  crsScore: number;
  documentsProgress: {
    uploaded: number;
    total: number;
  };
  checklistProgress: {
    completed: number;
    total: number;
  };
}

export interface RecentActivity {
  action: string;
  item: string;
  time: string;
  type: 'document' | 'crs' | 'profile' | 'checklist';
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get active immigration file
      const activeFileResponse = await immigrationService.getActiveImmigrationFile();
      const activeFile = activeFileResponse?.immigrationFile;

      if (!activeFile) {
        return {
          totalFiles: 0,
          completedTasks: 0,
          pendingTasks: 0,
          totalDocuments: 0,
          applicationProgress: 0,
          crsScore: 0,
          documentsProgress: { uploaded: 0, total: 12 },
          checklistProgress: { completed: 0, total: 0 },
        };
      }

      // Calculate stats from active file
      const totalDocuments = activeFile.documents?.length || 0;
      const completedTasks = activeFile.checklist?.filter((item: any) => item.isCompleted)?.length || 0;
      const totalTasks = activeFile.checklist?.length || 0;
      const pendingTasks = totalTasks - completedTasks;

      // Calculate application progress based on profile completion
      let progressScore = 0;
      const maxScore = 100;

      // Personal info (20 points)
      if (activeFile.personalInfo?.firstName && activeFile.personalInfo?.lastName) {
        progressScore += 20;
      }

      // Contact info (20 points)
      if (activeFile.contactInfo?.email && activeFile.contactInfo?.phone) {
        progressScore += 20;
      }

      // Education (20 points)
      if (activeFile.education?.highestEducation) {
        progressScore += 20;
      }

      // Work experience (20 points)
      if (activeFile.workExperience?.currentJob) {
        progressScore += 20;
      }

      // Language proficiency (20 points)
      if (activeFile.languageProficiency?.englishListening) {
        progressScore += 20;
      }

      const applicationProgress = Math.min(progressScore, maxScore);

      return {
        totalFiles: 1,
        completedTasks,
        pendingTasks,
        totalDocuments,
        applicationProgress,
        crsScore: activeFile.CRSScore || 0,
        documentsProgress: {
          uploaded: totalDocuments,
          total: 12, // Standard document requirement
        },
        checklistProgress: {
          completed: completedTasks,
          total: totalTasks,
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalFiles: 0,
        completedTasks: 0,
        pendingTasks: 0,
        totalDocuments: 0,
        applicationProgress: 0,
        crsScore: 0,
        documentsProgress: { uploaded: 0, total: 12 },
        checklistProgress: { completed: 0, total: 0 },
      };
    }
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      // Get active immigration file
      const activeFileResponse = await immigrationService.getActiveImmigrationFile();
      const activeFile = activeFileResponse?.immigrationFile;

      if (!activeFile) {
        return [];
      }

      const activities: RecentActivity[] = [];

      // Add recent documents
      if (activeFile.documents) {
        activeFile.documents
          .sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
          .slice(0, 3)
          .forEach((doc: any) => {
            activities.push({
              action: 'Document uploaded',
              item: doc.title,
              time: this.formatTimeAgo(doc.uploadedAt),
              type: 'document',
            });
          });
      }

      // Add recent checklist updates
      if (activeFile.checklist) {
        activeFile.checklist
          .filter((item: any) => item.isCompleted)
          .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 2)
          .forEach((item: any) => {
            activities.push({
              action: 'Task completed',
              item: item.title,
              time: this.formatTimeAgo(item.updatedAt),
              type: 'checklist',
            });
          });
      }

      // Add CRS score update if available
      if (activeFile.CRSScore > 0) {
        activities.push({
          action: 'CRS Score updated',
          item: `New score: ${activeFile.CRSScore} points`,
          time: this.formatTimeAgo(activeFile.updatedAt),
          type: 'crs',
        });
      }

      // Sort by most recent and limit to 5
      return activities
        .sort((a, b) => this.parseTimeAgo(a.time) - this.parseTimeAgo(b.time))
        .slice(0, 5);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  private parseTimeAgo(timeString: string): number {
    if (timeString === 'Just now') return 0;
    
    const match = timeString.match(/(\d+)\s+(hour|day)s?\s+ago/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      return unit === 'hour' ? value : value * 24;
    }
    
    return 999; // For date strings, put them last
  }
}

const dashboardService = new DashboardService();
export default dashboardService;