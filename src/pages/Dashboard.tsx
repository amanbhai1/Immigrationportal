import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  FileText,
  Calculator,
  Upload,
  Folder,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Calendar,
  Bell,
  ArrowRight,
  Target,
  Award,
  Globe,
  Loader2,
} from "lucide-react";
import dashboardService, { DashboardStats, RecentActivity } from "@/services/dashboardService";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, activity] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivity(),
      ]);
      setDashboardStats(stats);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Generate quick stats from real data
  const getQuickStats = () => {
    if (!dashboardStats) return [];

    return [
      {
        title: "Application Progress",
        value: `${dashboardStats.applicationProgress}%`,
        subtitle: dashboardStats.applicationProgress >= 80 ? "Almost complete" : dashboardStats.applicationProgress >= 50 ? "In progress" : "Getting started",
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
        change: dashboardStats.applicationProgress >= 75 ? "On track" : "Keep going",
        changeColor: dashboardStats.applicationProgress >= 75 ? "text-green-600" : "text-orange-600",
      },
      {
        title: "Documents",
        value: `${dashboardStats.documentsProgress.uploaded}/${dashboardStats.documentsProgress.total}`,
        subtitle: `${dashboardStats.documentsProgress.total - dashboardStats.documentsProgress.uploaded} remaining`,
        icon: FileText,
        color: "text-green-600",
        bgColor: "bg-gradient-to-br from-green-50 to-green-100",
        change: dashboardStats.documentsProgress.uploaded > 0 ? "Documents uploaded" : "No documents yet",
        changeColor: "text-green-600",
      },
      {
        title: "CRS Score",
        value: dashboardStats.crsScore.toString(),
        subtitle: dashboardStats.crsScore >= 470 ? "Competitive" : dashboardStats.crsScore >= 400 ? "Good" : dashboardStats.crsScore > 0 ? "Needs improvement" : "Not calculated",
        icon: Calculator,
        color: "text-purple-600",
        bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
        change: dashboardStats.crsScore > 0 ? "Score calculated" : "Calculate now",
        changeColor: dashboardStats.crsScore >= 470 ? "text-green-600" : "text-orange-600",
      },
      {
        title: "Checklist",
        value: `${dashboardStats.checklistProgress.completed}/${dashboardStats.checklistProgress.total}`,
        subtitle: dashboardStats.checklistProgress.total > 0 ? `${Math.round((dashboardStats.checklistProgress.completed / dashboardStats.checklistProgress.total) * 100)}% complete` : "No tasks yet",
        icon: CheckSquare,
        color: "text-orange-600",
        bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
        change: dashboardStats.checklistProgress.completed > 0 ? "Tasks completed" : "Start checklist",
        changeColor: "text-green-600",
      },
    ];
  };

  // Quick actions for navigation
  const quickActions = [
    {
      title: "Immigration File",
      description: "View and edit your personal information",
      icon: FileText,
      href: "/immigration-file",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      title: "CRS Score Calculator",
      description: "Calculate your ranking score",
      icon: Calculator,
      href: "/crs-score",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      title: "Document Upload",
      description: "Upload required documents",
      icon: Upload,
      href: "/document-upload",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      title: "Application Category",
      description: "Select immigration program",
      icon: Folder,
      href: "/application-category",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
    },
    {
      title: "Progress Checklist",
      description: "Track your milestones",
      icon: CheckSquare,
      href: "/checklist",
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
      hoverColor: "hover:from-pink-600 hover:to-pink-700",
    },
  ];

  // Map activity types to icons and colors
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document':
        return { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" };
      case 'crs':
        return { icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-100" };
      case 'profile':
        return { icon: Users, color: "text-purple-600", bgColor: "bg-purple-100" };
      case 'checklist':
        return { icon: CheckSquare, color: "text-orange-600", bgColor: "bg-orange-100" };
      default:
        return { icon: Bell, color: "text-gray-600", bgColor: "bg-gray-100" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quickStats = getQuickStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-lg text-gray-600">
                Here's your immigration journey overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={fetchDashboardData}
              >
                <Bell className="h-4 w-4" />
                Refresh
              </Button>
              <Avatar className="h-12 w-12 border-2 border-blue-200">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className={`${stat.bgColor} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/80 p-3 rounded-xl">
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <Badge
                        className={`${stat.changeColor} bg-white/80 text-xs`}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-xs text-gray-600">{stat.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-base">
                  Navigate to key sections of your portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Card
                        key={index}
                        className="border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group overflow-hidden"
                      >
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div
                                className={`${action.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}
                              >
                                <Icon className="h-6 w-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {action.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                            <Button
                              asChild
                              className={`w-full ${action.color} ${action.hoverColor} text-white shadow-lg`}
                            >
                              <Link to={action.href} className="gap-2">
                                Open {action.title}
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Application Progress */}
            <Card className="border-0 shadow-lg mt-8">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Application Progress
                </CardTitle>
                <CardDescription>
                  Your immigration application status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="font-medium text-gray-700">
                        Overall Completion
                      </span>
                      <span className="text-blue-600 font-bold">{dashboardStats?.applicationProgress || 0}%</span>
                    </div>
                    <Progress value={dashboardStats?.applicationProgress || 0} className="h-3" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Profile Complete
                          </p>
                          <p className="text-sm text-gray-600">
                            Personal information verified
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            CRS Score Calculated
                          </p>
                          <p className="text-sm text-gray-600">
                            Competitive score achieved
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Document Collection
                          </p>
                          <p className="text-sm text-gray-600">
                            {dashboardStats?.documentsProgress.uploaded || 0} of {dashboardStats?.documentsProgress.total || 12} documents uploaded
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Application Submission
                          </p>
                          <p className="text-sm text-gray-600">
                            Pending document completion
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Medical Examination
                          </p>
                          <p className="text-sm text-gray-600">
                            Scheduled after ITA
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Final Decision
                          </p>
                          <p className="text-sm text-gray-600">
                            Awaiting review
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => {
                      const iconData = getActivityIcon(activity.type);
                      const Icon = iconData.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className={`p-2 rounded-lg ${iconData.bgColor}`}>
                            <Icon className={`h-4 w-4 ${iconData.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {activity.action}
                            </p>
                            <p className="text-sm text-gray-600">
                              {activity.item}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No recent activity</p>
                      <p className="text-sm text-gray-500">Start by updating your profile or uploading documents</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Quick Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 border-blue-200 hover:bg-blue-50"
                  >
                    <Calendar className="h-4 w-4 text-blue-600" />
                    View Calendar
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 border-green-200 hover:bg-green-50"
                  >
                    <FileText className="h-4 w-4 text-green-600" />
                    Download Forms
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 border-purple-200 hover:bg-purple-50"
                  >
                    <Users className="h-4 w-4 text-purple-600" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
