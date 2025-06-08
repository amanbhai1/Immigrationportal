import api from './api';

export interface ApplicationCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  eligibility: string[];
  requirements: string[];
  processingTime: string;
  minCRS: number;
  popularity: 'high' | 'medium' | 'low';
  status: 'selected' | 'available' | 'not-eligible';
}



class ApplicationCategoryService {
  // Get application categories for the logged-in user
  async getApplicationCategories() {
    try {
      const response = await api.get('/immigration-files/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching application categories:', error);
      throw error;
    }
  }

  // Update application category
  async updateApplicationCategory(category: string) {
    try {
      const response = await api.put('/immigration-files/category', { category });
      return response.data;
    } catch (error) {
      console.error('Error updating application category:', error);
      throw error;
    }
  }

  // Get application category by ID
  async getApplicationCategoryById(id: string) {
    try {
      const response = await this.getApplicationCategories();
      const category = response.categories?.find((cat: ApplicationCategory) => cat.id === id);
      if (category) {
        return category;
      } else {
        throw new Error('Category not found');
      }
    } catch (error) {
      console.error('Error fetching application category by ID:', error);
      throw error;
    }
  }

  // Get status color
  getStatusColor(status: string): string {
    switch (status) {
      case 'Approved':
        return 'green';
      case 'In Review':
        return 'yellow';
      case 'Rejected':
        return 'red';
      default:
        return 'gray';
    }
  }

  // Get category icon
  getCategoryIcon(category: string): string {
    // Map category names to icons
    const iconMap: Record<string, string> = {
      'Express Entry': '🇨🇦',
      'Family Sponsorship': '👪',
      'Study Permit': '🎓',
      'Work Permit': '💼',
      'Provincial Nominee': '🏛️',
      'Citizenship': '📜',
      'Business Immigration': '💰',
      'Humanitarian': '❤️',
    };

    return iconMap[category] || '📄';
  }
}

const applicationCategoryService = new ApplicationCategoryService();
export default applicationCategoryService;