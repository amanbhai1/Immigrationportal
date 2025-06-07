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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Users,
  CreditCard,
  Globe,
  Shield,
  Stethoscope,
  GraduationCap,
  Download,
  Printer,
  Search,
  Filter,
  Target,
  Award,
} from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  status: "completed" | "in-progress" | "pending";
  isRequired: boolean;
  estimatedTime: string;
  icon: any;
  dependencies?: string[];
  resources?: string[];
  notes?: string;
}

const Checklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Complete Language Testing",
      description: "Take IELTS, CELPIP, or other approved language test",
      category: "Language Proficiency",
      priority: "high",
      status: "completed",
      isRequired: true,
      estimatedTime: "2-4 weeks",
      icon: Globe,
      resources: [
        "Official IELTS website",
        "CELPIP test centers",
        "Language preparation courses",
      ],
      notes: "IELTS Academic required for immigration purposes",
    },
    {
      id: "2",
      title: "Educational Credential Assessment (ECA)",
      description: "Get your foreign education credentials assessed",
      category: "Education",
      priority: "high",
      status: "completed",
      isRequired: true,
      estimatedTime: "6-8 weeks",
      icon: GraduationCap,
      resources: ["WES Canada", "ICAS", "IQAS"],
      notes: "WES is most commonly used and faster",
    },
    {
      id: "3",
      title: "Gather Work Experience Documentation",
      description:
        "Collect reference letters from current and previous employers",
      category: "Employment",
      priority: "high",
      status: "in-progress",
      isRequired: true,
      estimatedTime: "2-3 weeks",
      icon: FileText,
      dependencies: [
        "Contact HR departments",
        "Format according to IRCC requirements",
      ],
      notes: "Letters must be on company letterhead with specific details",
    },
    {
      id: "4",
      title: "Create Express Entry Profile",
      description: "Submit your Express Entry profile online",
      category: "Application",
      priority: "high",
      status: "pending",
      isRequired: true,
      estimatedTime: "1-2 hours",
      icon: Users,
      dependencies: ["1", "2", "3"],
      notes: "Profile expires after 12 months if no ITA received",
    },
    {
      id: "5",
      title: "Obtain Police Clearance Certificates",
      description: "Get police certificates from all countries where you lived",
      category: "Background Check",
      priority: "medium",
      status: "pending",
      isRequired: true,
      estimatedTime: "4-12 weeks",
      icon: Shield,
      resources: ["Country-specific requirements", "Embassy contacts"],
      notes:
        "Required for all countries where you lived for 6+ months since age 18",
    },
    {
      id: "6",
      title: "Medical Examination",
      description: "Complete medical exam with an approved panel physician",
      category: "Medical",
      priority: "medium",
      status: "pending",
      isRequired: true,
      estimatedTime: "1-2 weeks",
      icon: Stethoscope,
      dependencies: ["Receive Invitation to Apply (ITA)"],
      notes: "Only required after receiving ITA",
    },
    {
      id: "7",
      title: "Proof of Funds",
      description: "Gather bank statements and financial documentation",
      category: "Financial",
      priority: "high",
      status: "in-progress",
      isRequired: true,
      estimatedTime: "1 week",
      icon: CreditCard,
      resources: [
        "Bank statements (6 months)",
        "Investment portfolio",
        "Gift deed (if applicable)",
      ],
      notes: "$13,310 CAD required for single applicant",
    },
    {
      id: "8",
      title: "Passport and Photos",
      description: "Ensure passport is valid and obtain passport-sized photos",
      category: "Documentation",
      priority: "medium",
      status: "completed",
      isRequired: true,
      estimatedTime: "1-2 days",
      icon: FileText,
      notes: "Passport must be valid for at least 6 months",
    },
    {
      id: "9",
      title: "Birth Certificate",
      description:
        "Obtain official birth certificate and translation if needed",
      category: "Documentation",
      priority: "medium",
      status: "completed",
      isRequired: true,
      estimatedTime: "1-2 weeks",
      icon: FileText,
      notes: "Must be long-form birth certificate",
    },
    {
      id: "10",
      title: "Marriage Certificate (if applicable)",
      description: "Provide marriage certificate and spouse documentation",
      category: "Family Documentation",
      priority: "medium",
      status: "completed",
      isRequired: false,
      estimatedTime: "1 week",
      icon: Users,
      notes: "Required if including spouse in application",
    },
    {
      id: "11",
      title: "Digital Photo Requirements",
      description: "Prepare digital photos meeting IRCC specifications",
      category: "Documentation",
      priority: "low",
      status: "pending",
      isRequired: true,
      estimatedTime: "1 day",
      icon: FileText,
      notes: "35mm x 45mm, high resolution, plain background",
    },
    {
      id: "12",
      title: "Travel History",
      description: "Compile complete travel history for the past 10 years",
      category: "Background Information",
      priority: "low",
      status: "in-progress",
      isRequired: true,
      estimatedTime: "2-3 hours",
      icon: Globe,
      notes: "Include all international travel with exact dates",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleItemStatus = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newStatus =
            item.status === "completed" ? "pending" : "completed";
          toast.success(
            newStatus === "completed"
              ? `"${item.title}" marked as completed!`
              : `"${item.title}" marked as pending`,
          );
          return { ...item, status: newStatus };
        }
        return item;
      }),
    );
  };

  const categories = Array.from(new Set(items.map((item) => item.category)));
  const statuses = ["all", "completed", "in-progress", "pending"];

  const getCompletionStats = () => {
    const completed = items.filter(
      (item) => item.status === "completed",
    ).length;
    const total = items.length;
    const percentage = (completed / total) * 100;
    return { completed, total, percentage };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Pending
          </Badge>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50/30";
      case "medium":
        return "border-l-orange-500 bg-orange-50/30";
      default:
        return "border-l-blue-500 bg-blue-50/30";
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const stats = getCompletionStats();

  const isItemEnabled = (item: ChecklistItem) => {
    if (!item.dependencies) return true;
    return item.dependencies.every(
      (depId) => items.find((i) => i.id === depId)?.status === "completed",
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Immigration Checklist
            </h1>
            <p className="text-lg text-gray-600">
              Track your progress through the immigration process
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-green-200 hover:bg-green-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Overall Progress
                </h3>
                <p className="text-lg text-gray-600">
                  {stats.completed} of {stats.total} items completed
                </p>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Math.round(stats.percentage)}%
                </div>
                <Progress
                  value={stats.percentage}
                  className="w-full lg:w-64 h-3 mb-2"
                />
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {items.filter((i) => i.status === "completed").length}
                  </div>
                  <div className="text-sm font-medium text-green-700">
                    Completed
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-orange-200 bg-orange-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {items.filter((i) => i.status === "in-progress").length}
                  </div>
                  <div className="text-sm font-medium text-orange-700">
                    In Progress
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-gray-600 mb-1">
                    {items.filter((i) => i.status === "pending").length}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Pending
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search checklist items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Filter className="h-4 w-4 text-gray-500" />
            <Label className="text-sm text-gray-600">Category:</Label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Label className="text-sm text-gray-600">Status:</Label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status} className="capitalize">
                  {status === "all" ? "All Status" : status.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checklist by Category */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryItems = filteredItems.filter(
              (item) => item.category === category,
            );
            if (categoryItems.length === 0) return null;

            const completedInCategory = categoryItems.filter(
              (item) => item.status === "completed",
            ).length;
            const categoryProgress =
              (completedInCategory / categoryItems.length) * 100;

            return (
              <Card key={category} className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {category}
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        {completedInCategory} of {categoryItems.length} items
                        completed
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-1">
                        {Math.round(categoryProgress)}%
                      </div>
                      <Progress
                        value={categoryProgress}
                        className="w-32 h-2 bg-white/20"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {categoryItems.map((item) => {
                      const Icon = item.icon;
                      const isEnabled = isItemEnabled(item);

                      return (
                        <div
                          key={item.id}
                          className={`border-l-4 pl-6 py-4 rounded-r-lg ${getPriorityColor(item.priority)} ${
                            !isEnabled ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={item.status === "completed"}
                              onCheckedChange={() => toggleItemStatus(item.id)}
                              disabled={!isEnabled}
                              className="mt-1"
                            />

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-4">
                                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                                    <Icon className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-lg text-gray-900 mb-1">
                                      {item.title}
                                      {item.isRequired && (
                                        <span className="text-red-500 ml-1">
                                          *
                                        </span>
                                      )}
                                    </h4>
                                    <p className="text-gray-600 mb-2">
                                      {item.description}
                                    </p>
                                    {item.notes && (
                                      <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                        <strong>Note:</strong> {item.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(item.status)}
                                  {getStatusBadge(item.status)}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Est. time: {item.estimatedTime}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    item.priority === "high"
                                      ? "border-red-200 text-red-600"
                                      : item.priority === "medium"
                                        ? "border-orange-200 text-orange-600"
                                        : "border-blue-200 text-blue-600"
                                  }`}
                                >
                                  {item.priority} priority
                                </Badge>
                                {!isEnabled && item.dependencies && (
                                  <span className="text-orange-600 font-medium">
                                    Waiting for dependencies
                                  </span>
                                )}
                              </div>

                              {item.resources && item.resources.length > 0 && (
                                <div className="mb-3">
                                  <div className="text-xs font-medium text-gray-700 mb-1">
                                    Resources:
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {item.resources.join(" ��� ")}
                                  </div>
                                </div>
                              )}

                              {item.dependencies && !isEnabled && (
                                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
                                  <strong>Dependencies:</strong> Complete
                                  required items first:{" "}
                                  {item.dependencies
                                    .map(
                                      (depId) =>
                                        items.find((i) => i.id === depId)
                                          ?.title,
                                    )
                                    .filter(Boolean)
                                    .join(", ")}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Information Panel */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Important Notes & Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  General Information
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Items marked with{" "}
                    <span className="text-red-500 font-medium">*</span> are
                    required for your application
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Some items may only be available after receiving an
                    Invitation to Apply (ITA)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Processing times are estimates and may vary by country of
                    residence
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Keep all original documents and certified copies for your
                    records
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Tips for Success
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Start with high-priority items first to avoid delays
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Check for updates regularly as requirements may change
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Set reminders for document expiry dates
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Consider professional help for complex requirements
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checklist;
