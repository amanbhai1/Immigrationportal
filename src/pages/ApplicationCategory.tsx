import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  program: string;
  description: string;
  eligibility: string[];
  requirements: string[];
  processingTime: string;
  minCRS: number;
  status: "available" | "selected" | "not-eligible";
  popularity: "high" | "medium" | "low";
  icon: any;
}

const ApplicationCategory = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("express-entry-fsw");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const categories: Category[] = [
    {
      id: "express-entry-fsw",
      name: "Federal Skilled Worker",
      program: "Express Entry",
      description:
        "For skilled workers with foreign work experience who want to immigrate to Canada permanently.",
      eligibility: [
        "At least 1 year of continuous full-time skilled work experience",
        "Language proficiency in English and/or French",
        "Education equivalent to Canadian high school",
        "Meet minimum requirements in all six selection factors",
      ],
      requirements: [
        "Minimum CLB 7 in all language abilities",
        "Educational Credential Assessment (ECA)",
        "Proof of work experience",
        "Proof of funds ($13,310 for single applicant)",
      ],
      processingTime: "6 months",
      minCRS: 470,
      status: "selected",
      popularity: "high",
      icon: Briefcase,
    },
    {
      id: "express-entry-cec",
      name: "Canadian Experience Class",
      program: "Express Entry",
      description:
        "For skilled workers who have Canadian work experience and want to become permanent residents.",
      eligibility: [
        "At least 1 year of skilled work experience in Canada",
        "Language proficiency requirements",
        "Plan to live outside Quebec",
      ],
      requirements: [
        "Minimum CLB 7 for NOC TEER 0 or 1",
        "Minimum CLB 5 for NOC TEER 2 or 3",
        "Canadian work experience letters",
        "Language test results",
      ],
      processingTime: "6 months",
      minCRS: 450,
      status: "available",
      popularity: "high",
      icon: MapPin,
    },
    {
      id: "express-entry-pnp",
      name: "Provincial Nominee Program",
      program: "Express Entry",
      description:
        "For workers who have the skills, education and work experience to contribute to a specific province.",
      eligibility: [
        "Meet provincial nominee requirements",
        "Meet federal Express Entry requirements",
        "Intent to live in nominating province",
      ],
      requirements: [
        "Provincial nomination certificate",
        "Meet Express Entry pool requirements",
        "Language test results",
        "Educational credentials",
      ],
      processingTime: "6 months + provincial processing",
      minCRS: 600,
      status: "available",
      popularity: "medium",
      icon: Star,
    },
    {
      id: "family-sponsorship",
      name: "Family Class Sponsorship",
      program: "Family Class",
      description:
        "For Canadian citizens and permanent residents to sponsor eligible relatives.",
      eligibility: [
        "Canadian citizen or permanent resident sponsor",
        "Meet financial requirements",
        "Eligible relationship to sponsored person",
      ],
      requirements: [
        "Sponsorship agreement and undertaking",
        "Financial evaluation",
        "Relationship proof",
        "Background checks",
      ],
      processingTime: "12-24 months",
      minCRS: 0,
      status: "available",
      popularity: "medium",
      icon: Users,
    },
    {
      id: "start-up-visa",
      name: "Start-up Visa Program",
      program: "Economic Class",
      description:
        "For entrepreneurs with innovative business ideas and support from designated organizations.",
      eligibility: [
        "Qualifying business and commitment",
        "Letter of support from designated organization",
        "Language requirements",
        "Sufficient funds",
      ],
      requirements: [
        "Business plan and commitment certificate",
        "Letter of support from designated organization",
        "CLB 5 minimum language proficiency",
        "Proof of funds",
      ],
      processingTime: "12-16 months",
      minCRS: 0,
      status: "not-eligible",
      popularity: "low",
      icon: GraduationCap,
    },
    {
      id: "caregiver-program",
      name: "Home Child Care Provider",
      program: "Caregiver Program",
      description:
        "For qualified caregivers who want to work in Canada and eventually become permanent residents.",
      eligibility: [
        "Education equivalent to Canadian high school",
        "Language proficiency",
        "Recent relevant work experience or training",
      ],
      requirements: [
        "Educational credential assessment",
        "CLB 5 language proficiency",
        "Work experience or training certificates",
        "Job offer (if applicable)",
      ],
      processingTime: "12-24 months",
      minCRS: 0,
      status: "available",
      popularity: "low",
      icon: Users,
    },
  ];

  const provinces = [
    { value: "alberta", label: "Alberta" },
    { value: "bc", label: "British Columbia" },
    { value: "manitoba", label: "Manitoba" },
    { value: "nb", label: "New Brunswick" },
    { value: "nf", label: "Newfoundland and Labrador" },
    { value: "nt", label: "Northwest Territories" },
    { value: "ns", label: "Nova Scotia" },
    { value: "nunavut", label: "Nunavut" },
    { value: "ontario", label: "Ontario" },
    { value: "pei", label: "Prince Edward Island" },
    { value: "saskatchewan", label: "Saskatchewan" },
    { value: "yukon", label: "Yukon" },
  ];

  const subCategories = {
    "express-entry-fsw": [
      { value: "fsw-general", label: "General FSW Stream" },
      { value: "fsw-arranged", label: "FSW with Arranged Employment" },
    ],
    "express-entry-pnp": [
      { value: "pnp-skilled", label: "Skilled Worker Stream" },
      { value: "pnp-entrepreneur", label: "Entrepreneur Stream" },
      { value: "pnp-international", label: "International Graduate Stream" },
    ],
    "family-sponsorship": [
      { value: "spouse", label: "Spouse/Partner Sponsorship" },
      { value: "child", label: "Dependent Child Sponsorship" },
      { value: "parent", label: "Parent/Grandparent Sponsorship" },
    ],
  };

  const selectedCat = categories.find((cat) => cat.id === selectedCategory);

  const handleSelectCategory = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category?.status === "not-eligible") {
      toast.error(
        "You may not be eligible for this program based on your profile.",
      );
      return;
    }

    setSelectedCategory(categoryId);
    setSelectedSubCategory(""); // Reset subcategory when main category changes
    toast.success(`${category?.name} program selected!`);
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
            className={`h-3 w-3 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Application Categories
          </h1>
          <p className="text-lg text-gray-600">
            Choose the immigration program that best fits your profile and goals
          </p>
        </div>

        {/* Current Selection Alert */}
        {selectedCat && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Currently Selected:</strong> {selectedCat.name} under the{" "}
              {selectedCat.program} program. You can change your selection at
              any time before submitting your application.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Categories List */}
          <div className="xl:col-span-2">
            <div className="space-y-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;

                return (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-0 shadow-lg ${
                      isSelected
                        ? "ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-blue-100"
                        : "hover:shadow-xl"
                    } ${category.status === "not-eligible" ? "opacity-60" : ""}`}
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
                            <Badge
                              variant="outline"
                              className="text-xs text-blue-600 border-blue-200 mb-3"
                            >
                              {category.program}
                            </Badge>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Processing: {category.processingTime}
                          </span>
                        </div>
                        {category.minCRS > 0 && (
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600">
                              Min CRS: {category.minCRS}+
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-gray-600 capitalize">
                            {category.popularity === "high"
                              ? "Most Popular"
                              : category.popularity === "medium"
                                ? "Popular"
                                : "Specialized"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 mb-2">
                            Key Eligibility Criteria:
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {category.eligibility
                              .slice(0, 2)
                              .map((item, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t flex justify-between items-center">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCategory(category.id);
                          }}
                          disabled={category.status === "not-eligible"}
                          className={
                            isSelected
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "border-blue-200 hover:bg-blue-50"
                          }
                        >
                          {isSelected ? "Selected" : "Select Program"}
                          {!isSelected && (
                            <ArrowRight className="h-4 w-4 ml-2" />
                          )}
                        </Button>

                        {category.status === "not-eligible" && (
                          <span className="text-xs text-red-600 font-medium">
                            Profile mismatch
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Selection Details Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Selected Category Details */}
              {selectedCat && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <selectedCat.icon className="h-5 w-5" />
                      {selectedCat.name}
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      {selectedCat.program}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Category Selection */}
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="category"
                          className="font-medium text-gray-700"
                        >
                          Selected Program
                        </Label>
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger className="mt-1 h-12 border-gray-200 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter((cat) => cat.status !== "not-eligible")
                              .map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name} - {cat.program}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sub-category Selection */}
                      {subCategories[
                        selectedCategory as keyof typeof subCategories
                      ] && (
                        <div>
                          <Label
                            htmlFor="subCategory"
                            className="font-medium text-gray-700"
                          >
                            Stream/Sub-Category
                          </Label>
                          <Select
                            value={selectedSubCategory}
                            onValueChange={setSelectedSubCategory}
                          >
                            <SelectTrigger className="mt-1 h-12 border-gray-200 focus:border-blue-500">
                              <SelectValue placeholder="Select a stream..." />
                            </SelectTrigger>
                            <SelectContent>
                              {subCategories[
                                selectedCategory as keyof typeof subCategories
                              ]?.map((sub) => (
                                <SelectItem key={sub.value} value={sub.value}>
                                  {sub.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Province Selection for PNP */}
                      {selectedCategory === "express-entry-pnp" && (
                        <div>
                          <Label
                            htmlFor="province"
                            className="font-medium text-gray-700"
                          >
                            Preferred Province
                          </Label>
                          <Select
                            value={selectedProvince}
                            onValueChange={setSelectedProvince}
                          >
                            <SelectTrigger className="mt-1 h-12 border-gray-200 focus:border-blue-500">
                              <SelectValue placeholder="Select a province..." />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem
                                  key={province.value}
                                  value={province.value}
                                >
                                  {province.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Eligibility Requirements
                      </h4>
                      <ul className="space-y-2">
                        {selectedCat.eligibility.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Required Documents
                      </h4>
                      <ul className="space-y-2">
                        {selectedCat.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t pt-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          Processing Time
                        </span>
                        <span className="text-sm text-gray-600">
                          {selectedCat.processingTime}
                        </span>
                      </div>
                      {selectedCat.minCRS > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Minimum CRS Score
                          </span>
                          <span className="text-sm text-gray-600">
                            {selectedCat.minCRS}+
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          Popularity
                        </span>
                        <div>{getPopularityStars(selectedCat.popularity)}</div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                      Proceed with Selection
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Help Section */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Not sure which program is right for you? Our eligibility
                    assessment can help you find the best path to Canadian
                    immigration.
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Take Eligibility Assessment
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-green-200 hover:bg-green-50"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Speak with Consultant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCategory;
