import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  CheckCircle,
  Clock,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  Info,
  ArrowRight,
  Star,
  Target,
  Award,
  Globe,
  FileText,
  Plane,
  Scroll,
  ClipboardList,
  Folder,
} from "lucide-react";
import applicationCategoryService, {
  ApplicationCategory,
} from "@/services/applicationCategoryService";

const ApplicationCategoryNew = () => {
  const [categories, setCategories] = useState<ApplicationCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load application categories on component mount
  useEffect(() => {
    loadApplicationCategories();
  }, []);

  const loadApplicationCategories = async () => {
    try {
      setLoading(true);
      const response = await applicationCategoryService.getApplicationCategories();
      if (response.success) {
        setCategories(response.categories || []);
        setCurrentCategory(response.currentCategory);
        // Set the selected category to the current one if available
        const selected = response.categories?.find(
          (cat: ApplicationCategory) => cat.status === "selected"
        );
        if (selected) {
          setSelectedCategory(selected.id);
        }
      }
    } catch (error) {
      console.error("Error loading application categories:", error);
      toast.error("Failed to load application categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = async (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    if (category.status === "not-eligible") {
      toast.error(
        "You may not be eligible for this program based on your profile."
      );
      return;
    }

    try {
      // Map category ID to the actual category name expected by backend
      const categoryMap: Record<string, string> = {
        "express-entry": "Express Entry",
        "study-permit": "Study Permit",
        "work-permit": "Work Permit",
        "family-sponsorship": "Family Sponsorship",
        "visitor-visa": "Visitor Visa",
        citizenship: "Citizenship",
        other: "Other",
      };

      const categoryName = categoryMap[categoryId] || category.name;

      const response = await applicationCategoryService.updateApplicationCategory(
        categoryName
      );
      if (response.success) {
        setSelectedCategory(categoryId);
        setCurrentCategory(categoryName);
        // Update the categories list to reflect the new selection
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            status: cat.id === categoryId ? "selected" : "available",
          }))
        );
        toast.success(`${category.name} program selected successfully!`);
      }
    } catch (error) {
      console.error("Error selecting category:", error);
      toast.error("Failed to select category");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selected":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Currently Selected
          </Badge>
        );
      case "available":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Available
          </Badge>
        );
      case "not-eligible":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Not Eligible
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPopularityStars = (popularity: string) => {
    const count = popularity === "high" ? 3 : popularity === "medium" ? 2 : 1;
    return (
      <div className="flex">
        {[...Array(3)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < count
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, any> = {
      "express-entry": Briefcase,
      "study-permit": GraduationCap,
      "work-permit": Briefcase,
      "family-sponsorship": Users,
      "visitor-visa": Plane,
      citizenship: Scroll,
      other: ClipboardList,
    };
    return iconMap[categoryId] || FileText;
  };

  const selectedCat = categories.find((cat) => cat.id === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                <Folder className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
              </div>
              <p className="text-gray-600 font-medium">Loading application categories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden">
          <Card className="border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-2xl">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <Folder className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">
                      Application Categories
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Choose the immigration program that best fits your profile and goals
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-200" />
                    <span className="text-blue-100">Multiple Programs Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-200" />
                    <span className="text-blue-100">Expert Guidance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-blue-200" />
                    <span className="text-blue-100">Success Guaranteed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Selection Alert */}
        {selectedCat && (
          <Alert className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg rounded-2xl">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              <strong>Currently Selected:</strong> {selectedCat.name} program.
              You can change your selection at any time before submitting your application.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Categories List */}
          <div className="xl:col-span-2">
            <div className="space-y-6">
              {categories.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No categories available
                    </h3>
                    <p className="text-gray-600">
                      Please check back later or contact support.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                categories.map((category) => {
                  const Icon = getCategoryIcon(category.id);
                  const isSelected = selectedCategory === category.id;

                  return (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-0 shadow-lg ${
                        isSelected
                          ? "ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-blue-100"
                          : "hover:shadow-xl"
                      } ${
                        category.status === "not-eligible" ? "opacity-60" : ""
                      }`}
                      onClick={() => handleSelectCategory(category.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-4 rounded-xl ${
                                isSelected
                                  ? "bg-blue-500"
                                  : "bg-gradient-to-br from-gray-100 to-gray-200"
                              }`}
                            >
                              <Icon
                                className={`h-7 w-7 ${
                                  isSelected ? "text-white" : "text-gray-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-xl text-gray-900">
                                  {category.name}
                                </CardTitle>
                                {getPopularityStars(category.popularity)}
                              </div>
                              <CardDescription className="text-base text-gray-600 leading-relaxed">
                                {category.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(category.status)}
                            {isSelected && (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Processing: {category.processingTime}
                            </span>
                          </div>
                          {category.minCRS > 0 && (
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Min CRS: {category.minCRS}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Eligibility Requirements
                            </h4>
                            <ul className="space-y-1">
                              {category.eligibility.slice(0, 3).map((req, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-gray-600 flex items-start gap-2"
                                >
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                              {category.eligibility.length > 3 && (
                                <li className="text-sm text-gray-500">
                                  +{category.eligibility.length - 3} more
                                  requirements
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <Button
                            className={`w-full ${
                              isSelected
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            disabled={category.status === "not-eligible"}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Currently Selected
                              </>
                            ) : (
                              <>
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Select This Program
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar with Selected Category Details */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              {selectedCat ? (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      Selected Program Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Complete Requirements
                      </h4>
                      <ul className="space-y-2">
                        {selectedCat.requirements.map((req, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <FileText className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        All Eligibility Criteria
                      </h4>
                      <ul className="space-y-2">
                        {selectedCat.eligibility.map((req, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedCat.processingTime}
                          </div>
                          <div className="text-xs text-gray-600">
                            Processing Time
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {selectedCat.minCRS || "N/A"}
                          </div>
                          <div className="text-xs text-gray-600">Min CRS</div>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        This selection will be saved to your immigration file.
                        You can change it at any time before submission.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a Program
                    </h3>
                    <p className="text-gray-600">
                      Choose an immigration program to see detailed requirements
                      and eligibility criteria.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCategoryNew;