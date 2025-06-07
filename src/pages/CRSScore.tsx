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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Calculator,
  TrendingUp,
  Info,
  Save,
  RotateCcw,
  Target,
  Award,
  Loader2,
  User,
  GraduationCap,
  Briefcase,
  MessageSquare,
  MapPin,
  Heart,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
} from "lucide-react";
import crsService, { CRSFormData } from "@/services/crsService";

const CRSScore = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CRSFormData>({
    age: 25,
    education: "bachelor",
    workExperience: 2,
    englishListening: 7.0,
    englishReading: 7.0,
    englishWriting: 7.0,
    englishSpeaking: 7.0,
    provincialNomination: false,
    jobOffer: false,
    siblingInCanada: false,
    hasSpouse: false,
    spouseEducation: "bachelor",
    spouseWorkExperience: 0,
    spouseEnglishListening: 6.0,
    spouseEnglishReading: 6.0,
    spouseEnglishWriting: 6.0,
    spouseEnglishSpeaking: 6.0,
  });

  const [previewScore, setPreviewScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    coreFactors: 0,
    spouseFactors: 0,
    additionalPoints: 0,
    total: 0
  });

  useEffect(() => {
    fetchCurrentCRSScore();
  }, []);

  useEffect(() => {
    // Calculate preview score whenever form data changes
    const preview = crsService.calculateCRSScoreLocally(formData);
    setPreviewScore(preview);
    setScoreBreakdown(crsService.getScoreBreakdown(formData));
  }, [formData]);

  const fetchCurrentCRSScore = async () => {
    try {
      setLoading(true);
      const response = await crsService.getCurrentCRSScore();
      setCurrentScore(response.currentScore);
      setLastUpdated(response.lastUpdated);
      
      // Load existing form data if available
      if (response.formData) {
        setFormData(response.formData);
      }
    } catch (error: any) {
      console.error('Error fetching CRS score:', error);
      
      // If it's a network error or server is down, continue with local calculations
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        toast.info('Working in offline mode - calculations will be done locally');
      } else {
        toast.error('Failed to load CRS score data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateAndSave = async () => {
    try {
      setCalculating(true);
      setSaving(true);
      
      const response = await crsService.calculateAndSaveCRSScore(formData);
      
      if (response.success) {
        setCurrentScore(response.CRSScore);
        setScoreBreakdown(response.breakdown || scoreBreakdown);
        setLastUpdated(new Date().toISOString());
        toast.success(`CRS Score calculated: ${response.CRSScore} points`);
        
        if (response.message?.includes('locally')) {
          toast.info('Score calculated locally - create an immigration file to save permanently');
        }
      } else {
        toast.error(response.message || 'Failed to calculate CRS score');
      }
    } catch (error: any) {
      console.error('Error calculating CRS score:', error);
      
      // Fallback to local calculation if backend fails
      try {
        const localScore = crsService.calculateCRSScoreLocally(formData);
        const localBreakdown = crsService.getScoreBreakdown(formData);
        setCurrentScore(localScore);
        setScoreBreakdown(localBreakdown);
        setLastUpdated(new Date().toISOString());
        toast.success(`CRS Score calculated locally: ${localScore} points`);
        toast.info('Working in offline mode - create an immigration file to save permanently');
      } catch (localError) {
        toast.error('Failed to calculate CRS score');
      }
    } finally {
      setCalculating(false);
      setSaving(false);
    }
  };

  const handleUpdateScore = async () => {
    try {
      setSaving(true);
      
      const response = await crsService.updateCRSScore(formData);
      
      if (response.success) {
        setCurrentScore(response.CRSScore);
        setScoreBreakdown(response.breakdown || scoreBreakdown);
        setLastUpdated(new Date().toISOString());
        toast.success(`CRS Score updated: ${response.CRSScore} points`);
        
        if (response.message?.includes('locally')) {
          toast.info('Score calculated locally - create an immigration file to save permanently');
        }
      } else {
        toast.error(response.message || 'Failed to update CRS score');
      }
    } catch (error: any) {
      console.error('Error updating CRS score:', error);
      
      // Fallback to local calculation if backend fails
      try {
        const localScore = crsService.calculateCRSScoreLocally(formData);
        const localBreakdown = crsService.getScoreBreakdown(formData);
        setCurrentScore(localScore);
        setScoreBreakdown(localBreakdown);
        setLastUpdated(new Date().toISOString());
        toast.success(`CRS Score calculated locally: ${localScore} points`);
        toast.info('Working in offline mode - create an immigration file to save permanently');
      } catch (localError) {
        toast.error('Failed to calculate CRS score');
      }
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      age: 25,
      education: "bachelor",
      workExperience: 2,
      englishListening: 7.0,
      englishReading: 7.0,
      englishWriting: 7.0,
      englishSpeaking: 7.0,
      provincialNomination: false,
      jobOffer: false,
      siblingInCanada: false,
      hasSpouse: false,
      spouseEducation: "bachelor",
      spouseWorkExperience: 0,
      spouseEnglishListening: 6.0,
      spouseEnglishReading: 6.0,
      spouseEnglishWriting: 6.0,
      spouseEnglishSpeaking: 6.0,
    });
    toast.info('Form reset to default values');
  };

  const handleInputChange = (field: keyof CRSFormData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getScoreCategory = (score: number) => {
    if (score >= 500)
      return {
        label: "Excellent",
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    if (score >= 450)
      return {
        label: "Competitive",
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    if (score >= 400)
      return {
        label: "Good",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    return {
      label: "Needs Improvement",
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    };
  };

  const scoreCategory = getScoreCategory(previewScore);
  const currentScoreCategory = getScoreCategory(currentScore);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading CRS Score Calculator...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CRS Score Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your Comprehensive Ranking System score for Express Entry. 
            Get an accurate assessment of your immigration prospects to Canada.
          </p>
        </div>

        {/* Score Display Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Saved Score */}
          <Card className={`border-0 shadow-lg ${currentScoreCategory.bgColor} ${currentScoreCategory.borderColor} border-2`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Save className="h-5 w-5 text-gray-600" />
                Current Saved Score
              </CardTitle>
              {lastUpdated && (
                <CardDescription className="text-sm">
                  Last updated: {new Date(lastUpdated).toLocaleDateString()}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentScore}
                  </div>
                  <Badge className={`${currentScoreCategory.color} text-white`}>
                    {currentScoreCategory.label}
                  </Badge>
                </div>
                <div className="text-right">
                  <Progress
                    value={(currentScore / 1200) * 100}
                    className="w-24 h-2 mb-2"
                  />
                  <span className="text-sm text-gray-600">
                    {currentScore}/1200
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview Score */}
          <Card className={`border-0 shadow-lg ${scoreCategory.bgColor} ${scoreCategory.borderColor} border-2`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5 text-gray-600" />
                Live Preview Score
              </CardTitle>
              <CardDescription className="text-sm">
                Updates automatically as you fill the form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {previewScore}
                  </div>
                  <Badge className={`${scoreCategory.color} text-white`}>
                    {scoreCategory.label}
                  </Badge>
                </div>
                <div className="text-right">
                  <Progress
                    value={(previewScore / 1200) * 100}
                    className="w-24 h-2 mb-2"
                  />
                  <span className="text-sm text-gray-600">
                    {previewScore}/1200
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score Breakdown Alert */}
        {previewScore > 0 && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="text-center">
                  <div className="font-semibold text-blue-900">{scoreBreakdown.coreFactors}</div>
                  <div className="text-sm text-blue-700">Core Factors</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-900">{scoreBreakdown.spouseFactors}</div>
                  <div className="text-sm text-blue-700">Spouse Factors</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-900">{scoreBreakdown.additionalPoints}</div>
                  <div className="text-sm text-blue-700">Additional Points</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-900">{scoreBreakdown.total}</div>
                  <div className="text-sm text-blue-700">Total Score</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="core" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-white shadow-sm border">
            <TabsTrigger
              value="core"
              className="py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Core Factors
            </TabsTrigger>
            <TabsTrigger
              value="spouse"
              className="py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Spouse Factors
            </TabsTrigger>
            <TabsTrigger
              value="additional"
              className="py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Star className="h-4 w-4 mr-2" />
              Additional Points
            </TabsTrigger>
            <TabsTrigger
              value="breakdown"
              className="py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Score Breakdown
            </TabsTrigger>
          </TabsList>

          {/* Core Human Capital Factors */}
          <TabsContent value="core">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Core Human Capital Factors
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Age, education, language ability, and work experience (up to 600 points)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2 font-medium text-gray-700">
                      <User className="h-4 w-4" />
                      Age
                    </Label>
                    <Select
                      value={formData.age.toString()}
                      onValueChange={(value) => handleInputChange("age", parseInt(value))}
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => i + 18).map((age) => (
                          <SelectItem key={age} value={age.toString()}>
                            {age} years old
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <Label htmlFor="education" className="flex items-center gap-2 font-medium text-gray-700">
                      <GraduationCap className="h-4 w-4" />
                      Level of Education
                    </Label>
                    <Select
                      value={formData.education}
                      onValueChange={(value) => handleInputChange("education", value)}
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="secondary">Secondary diploma (high school)</SelectItem>
                        <SelectItem value="certificate">One-year certificate</SelectItem>
                        <SelectItem value="diploma">Two-year diploma</SelectItem>
                        <SelectItem value="bachelor">Bachelor's degree</SelectItem>
                        <SelectItem value="master">Master's degree</SelectItem>
                        <SelectItem value="phd">Doctoral degree (PhD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="workExperience" className="flex items-center gap-2 font-medium text-gray-700">
                      <Briefcase className="h-4 w-4" />
                      Years of Work Experience
                    </Label>
                    <Select
                      value={formData.workExperience.toString()}
                      onValueChange={(value) => handleInputChange("workExperience", parseInt(value))}
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 21 }, (_, i) => i).map((years) => (
                          <SelectItem key={years} value={years.toString()}>
                            {years} {years === 1 ? 'year' : 'years'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* IELTS Scores */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <MessageSquare className="h-5 w-5" />
                    IELTS English Language Scores
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="englishListening" className="text-sm font-medium text-gray-600">
                        Listening
                      </Label>
                      <Select
                        value={formData.englishListening.toString()}
                        onValueChange={(value) => handleInputChange("englishListening", parseFloat(value))}
                      >
                        <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                            <SelectItem key={score} value={score.toString()}>
                              {score}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="englishReading" className="text-sm font-medium text-gray-600">
                        Reading
                      </Label>
                      <Select
                        value={formData.englishReading.toString()}
                        onValueChange={(value) => handleInputChange("englishReading", parseFloat(value))}
                      >
                        <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                            <SelectItem key={score} value={score.toString()}>
                              {score}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="englishWriting" className="text-sm font-medium text-gray-600">
                        Writing
                      </Label>
                      <Select
                        value={formData.englishWriting.toString()}
                        onValueChange={(value) => handleInputChange("englishWriting", parseFloat(value))}
                      >
                        <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                            <SelectItem key={score} value={score.toString()}>
                              {score}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="englishSpeaking" className="text-sm font-medium text-gray-600">
                        Speaking
                      </Label>
                      <Select
                        value={formData.englishSpeaking.toString()}
                        onValueChange={(value) => handleInputChange("englishSpeaking", parseFloat(value))}
                      >
                        <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                            <SelectItem key={score} value={score.toString()}>
                              {score}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spouse Factors */}
          <TabsContent value="spouse">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Spouse/Partner Factors
                </CardTitle>
                <CardDescription className="text-purple-100">
                  If you have a spouse or common-law partner (up to 40 points)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Has Spouse Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="hasSpouse" className="font-medium text-gray-700">
                      Do you have a spouse or common-law partner?
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Include your spouse/partner's information to get additional points
                    </p>
                  </div>
                  <Switch
                    id="hasSpouse"
                    checked={formData.hasSpouse}
                    onCheckedChange={(checked) => handleInputChange("hasSpouse", checked)}
                  />
                </div>

                {formData.hasSpouse && (
                  <div className="space-y-6 border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Spouse Education */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 font-medium text-gray-700">
                          <GraduationCap className="h-4 w-4" />
                          Spouse's Education Level
                        </Label>
                        <Select
                          value={formData.spouseEducation}
                          onValueChange={(value) => handleInputChange("spouseEducation", value)}
                        >
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="secondary">Secondary diploma (high school)</SelectItem>
                            <SelectItem value="certificate">One-year certificate</SelectItem>
                            <SelectItem value="diploma">Two-year diploma</SelectItem>
                            <SelectItem value="bachelor">Bachelor's degree</SelectItem>
                            <SelectItem value="master">Master's degree</SelectItem>
                            <SelectItem value="phd">Doctoral degree (PhD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Spouse Work Experience */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 font-medium text-gray-700">
                          <Briefcase className="h-4 w-4" />
                          Spouse's Work Experience (Years)
                        </Label>
                        <Select
                          value={formData.spouseWorkExperience?.toString() || "0"}
                          onValueChange={(value) => handleInputChange("spouseWorkExperience", parseInt(value))}
                        >
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 21 }, (_, i) => i).map((years) => (
                              <SelectItem key={years} value={years.toString()}>
                                {years} {years === 1 ? 'year' : 'years'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Spouse IELTS Scores */}
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 font-medium text-gray-700">
                        <MessageSquare className="h-4 w-4" />
                        Spouse's IELTS English Language Scores
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Listening</Label>
                          <Select
                            value={formData.spouseEnglishListening?.toString() || "6.0"}
                            onValueChange={(value) => handleInputChange("spouseEnglishListening", parseFloat(value))}
                          >
                            <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                                <SelectItem key={score} value={score.toString()}>
                                  {score}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Reading</Label>
                          <Select
                            value={formData.spouseEnglishReading?.toString() || "6.0"}
                            onValueChange={(value) => handleInputChange("spouseEnglishReading", parseFloat(value))}
                          >
                            <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                                <SelectItem key={score} value={score.toString()}>
                                  {score}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Writing</Label>
                          <Select
                            value={formData.spouseEnglishWriting?.toString() || "6.0"}
                            onValueChange={(value) => handleInputChange("spouseEnglishWriting", parseFloat(value))}
                          >
                            <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                                <SelectItem key={score} value={score.toString()}>
                                  {score}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Speaking</Label>
                          <Select
                            value={formData.spouseEnglishSpeaking?.toString() || "6.0"}
                            onValueChange={(value) => handleInputChange("spouseEnglishSpeaking", parseFloat(value))}
                          >
                            <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                                <SelectItem key={score} value={score.toString()}>
                                  {score}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Points */}
          <TabsContent value="additional">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Additional Points
                </CardTitle>
                <CardDescription className="text-green-100">
                  Extra points for job offers, nominations, and other factors (up to 600 points)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Provincial Nomination */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <Label htmlFor="provincialNomination" className="font-medium text-gray-700">
                      Provincial Nomination Program (PNP)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Do you have a nomination from a Canadian province? (+600 points)
                    </p>
                  </div>
                  <Switch
                    id="provincialNomination"
                    checked={formData.provincialNomination}
                    onCheckedChange={(checked) => handleInputChange("provincialNomination", checked)}
                  />
                </div>

                {/* Job Offer */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <Label htmlFor="jobOffer" className="font-medium text-gray-700">
                      Valid Job Offer in Canada
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Do you have a valid job offer from a Canadian employer? (+50 points)
                    </p>
                  </div>
                  <Switch
                    id="jobOffer"
                    checked={formData.jobOffer}
                    onCheckedChange={(checked) => handleInputChange("jobOffer", checked)}
                  />
                </div>

                {/* Sibling in Canada */}
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <Label htmlFor="siblingInCanada" className="font-medium text-gray-700">
                      Sibling in Canada
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Do you have a sibling who is a Canadian citizen or permanent resident? (+15 points)
                    </p>
                  </div>
                  <Switch
                    id="siblingInCanada"
                    checked={formData.siblingInCanada}
                    onCheckedChange={(checked) => handleInputChange("siblingInCanada", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Score Breakdown */}
          <TabsContent value="breakdown">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Detailed Score Breakdown
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  See how your points are calculated across different categories
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Core Factors Breakdown */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Core Human Capital Factors: {scoreBreakdown.coreFactors} points
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-blue-800">Age</div>
                        <div className="text-blue-600">
                          {formData.age >= 20 && formData.age <= 29 ? 110 :
                           formData.age >= 30 && formData.age <= 31 ? 105 :
                           formData.age >= 32 && formData.age <= 35 ? 100 :
                           formData.age >= 36 && formData.age <= 39 ? 90 :
                           formData.age >= 40 && formData.age <= 45 ? 80 :
                           formData.age >= 46 && formData.age <= 47 ? 70 : 0} pts
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-800">Education</div>
                        <div className="text-blue-600">
                          {formData.education === 'secondary' ? 30 :
                           formData.education === 'certificate' ? 90 :
                           formData.education === 'diploma' ? 98 :
                           formData.education === 'bachelor' ? 120 :
                           formData.education === 'master' ? 135 :
                           formData.education === 'phd' ? 150 : 0} pts
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-800">Language</div>
                        <div className="text-blue-600">
                          {(() => {
                            const englishCLB = Math.min(
                              Math.floor(formData.englishListening),
                              Math.floor(formData.englishReading),
                              Math.floor(formData.englishWriting),
                              Math.floor(formData.englishSpeaking)
                            );
                            return englishCLB >= 9 ? 136 :
                                   englishCLB >= 8 ? 124 :
                                   englishCLB >= 7 ? 110 :
                                   englishCLB >= 6 ? 88 :
                                   englishCLB >= 5 ? 68 :
                                   englishCLB >= 4 ? 32 : 0;
                          })()} pts
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-800">Work Experience</div>
                        <div className="text-blue-600">
                          {formData.workExperience >= 6 ? 80 :
                           formData.workExperience >= 4 ? 70 :
                           formData.workExperience >= 2 ? 60 :
                           formData.workExperience >= 1 ? 40 : 0} pts
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spouse Factors Breakdown */}
                  {formData.hasSpouse && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Spouse/Partner Factors: {scoreBreakdown.spouseFactors} points
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-purple-800">Education</div>
                          <div className="text-purple-600">
                            {formData.spouseEducation === 'secondary' ? 2 :
                             formData.spouseEducation === 'certificate' ? 6 :
                             formData.spouseEducation === 'diploma' ? 7 :
                             formData.spouseEducation === 'bachelor' ? 8 :
                             formData.spouseEducation === 'master' ? 10 :
                             formData.spouseEducation === 'phd' ? 10 : 0} pts
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-purple-800">Language</div>
                          <div className="text-purple-600">
                            {(() => {
                              if (!formData.spouseEnglishListening) return 0;
                              const spouseEnglishCLB = Math.min(
                                Math.floor(formData.spouseEnglishListening),
                                Math.floor(formData.spouseEnglishReading || 0),
                                Math.floor(formData.spouseEnglishWriting || 0),
                                Math.floor(formData.spouseEnglishSpeaking || 0)
                              );
                              return spouseEnglishCLB >= 9 ? 20 :
                                     spouseEnglishCLB >= 7 ? 16 :
                                     spouseEnglishCLB >= 5 ? 8 : 0;
                            })()} pts
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-purple-800">Work Experience</div>
                          <div className="text-purple-600">
                            {(formData.spouseWorkExperience || 0) >= 5 ? 10 :
                             (formData.spouseWorkExperience || 0) >= 3 ? 8 :
                             (formData.spouseWorkExperience || 0) >= 1 ? 5 : 0} pts
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Points Breakdown */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Additional Points: {scoreBreakdown.additionalPoints} points
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-green-800">Provincial Nomination</div>
                        <div className="text-green-600">
                          {formData.provincialNomination ? 600 : 0} pts
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-800">Job Offer</div>
                        <div className="text-green-600">
                          {formData.jobOffer ? 50 : 0} pts
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-800">Sibling in Canada</div>
                        <div className="text-green-600">
                          {formData.siblingInCanada ? 15 : 0} pts
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Score */}
                  <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Total CRS Score: {scoreBreakdown.total} / 1200
                      </h3>
                      <Progress
                        value={(scoreBreakdown.total / 1200) * 100}
                        className="w-full h-4 mb-2"
                      />
                      <Badge className={`${scoreCategory.color} text-white text-lg px-4 py-2`}>
                        {scoreCategory.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={handleCalculateAndSave}
            disabled={calculating || saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
            size="lg"
          >
            {calculating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-5 w-5" />
                Calculate & Save Score
              </>
            )}
          </Button>

          {currentScore > 0 && (
            <Button
              onClick={handleUpdateScore}
              disabled={saving}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-medium"
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Update Score
                </>
              )}
            </Button>
          )}

          <Button
            onClick={resetForm}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-medium"
            size="lg"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset Form
          </Button>
        </div>

        {/* Information Alert */}
        <Alert className="mt-8 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> This calculator provides an estimate based on the information you provide. 
            Your actual CRS score may vary depending on additional factors and official assessment. 
            For the most accurate evaluation, consult with an immigration professional.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default CRSScore;