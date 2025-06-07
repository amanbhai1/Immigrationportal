import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {Save,Edit,User,MapPin,Briefcase,GraduationCap,Globe,FileText,Loader2,} from "lucide-react";
import immigrationService, { ImmigrationFile as ImmigrationFileType, UpdateProfileData } from "@/services/immigrationService";

const ImmigrationFile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [immigrationFile, setImmigrationFile] = useState<ImmigrationFileType | null>(null);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    maritalStatus: "",

    // Contact Information
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",

    // Education
    highestEducation: "",
    fieldOfStudy: "",
    institution: "",
    graduationYear: "",

    // Work Experience
    currentJob: "",
    employer: "",
    workExperience: "",

    // Language Proficiency
    englishListening: "",
    englishReading: "",
    englishWriting: "",
    englishSpeaking: "",
    frenchListening: "",
    frenchReading: "",
    frenchWriting: "",
    frenchSpeaking: "",
  });

  useEffect(() => {
    fetchImmigrationFile();
  }, []);

  const fetchImmigrationFile = async () => {
    try {
      setLoading(true);
      const response = await immigrationService.getActiveImmigrationFile();
      const file = response?.immigrationFile;
      
      if (file) {
        setImmigrationFile(file);
        // Populate form data from the immigration file
        setFormData({
          // Personal Information
          firstName: file.personalInfo?.firstName || "",
          lastName: file.personalInfo?.lastName || "",
          dateOfBirth: file.personalInfo?.dateOfBirth ? file.personalInfo.dateOfBirth.split('T')[0] : "",
          nationality: file.personalInfo?.nationality || "",
          passportNumber: file.personalInfo?.passportNumber || "",
          maritalStatus: file.personalInfo?.maritalStatus || "",

          // Contact Information
          email: file.contactInfo?.email || "",
          phone: file.contactInfo?.phone || "",
          address: file.contactInfo?.address || "",
          city: file.contactInfo?.city || "",
          province: file.contactInfo?.province || "",
          postalCode: file.contactInfo?.postalCode || "",
          country: file.contactInfo?.country || "",

          // Education
          highestEducation: file.education?.highestEducation || "",
          fieldOfStudy: file.education?.fieldOfStudy || "",
          institution: file.education?.institution || "",
          graduationYear: file.education?.graduationYear || "",

          // Work Experience
          currentJob: file.workExperience?.currentJob || "",
          employer: file.workExperience?.employer || "",
          workExperience: file.workExperience?.workExperience || "",

          // Language Proficiency
          englishListening: file.languageProficiency?.englishListening?.toString() || "",
          englishReading: file.languageProficiency?.englishReading?.toString() || "",
          englishWriting: file.languageProficiency?.englishWriting?.toString() || "",
          englishSpeaking: file.languageProficiency?.englishSpeaking?.toString() || "",
          frenchListening: file.languageProficiency?.frenchListening?.toString() || "",
          frenchReading: file.languageProficiency?.frenchReading?.toString() || "",
          frenchWriting: file.languageProficiency?.frenchWriting?.toString() || "",
          frenchSpeaking: file.languageProficiency?.frenchSpeaking?.toString() || "",
        });
      }
    } catch (error) {
      console.error('Error fetching immigration file:', error);
      toast.error('Failed to load immigration file data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!immigrationFile) {
      toast.error("No immigration file found");
      return;
    }

    try {
      setSaving(true);
      
      const updateData: UpdateProfileData = {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          passportNumber: formData.passportNumber,
          maritalStatus: formData.maritalStatus,
        },
        contactInfo: {
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        education: {
          highestEducation: formData.highestEducation,
          fieldOfStudy: formData.fieldOfStudy,
          institution: formData.institution,
          graduationYear: formData.graduationYear,
        },
        workExperience: {
          currentJob: formData.currentJob,
          employer: formData.employer,
          workExperience: formData.workExperience,
        },
        languageProficiency: {
          englishListening: formData.englishListening ? parseFloat(formData.englishListening) : undefined,
          englishReading: formData.englishReading ? parseFloat(formData.englishReading) : undefined,
          englishWriting: formData.englishWriting ? parseFloat(formData.englishWriting) : undefined,
          englishSpeaking: formData.englishSpeaking ? parseFloat(formData.englishSpeaking) : undefined,
          frenchListening: formData.frenchListening ? parseFloat(formData.frenchListening) : undefined,
          frenchReading: formData.frenchReading ? parseFloat(formData.frenchReading) : undefined,
          frenchWriting: formData.frenchWriting ? parseFloat(formData.frenchWriting) : undefined,
          frenchSpeaking: formData.frenchSpeaking ? parseFloat(formData.frenchSpeaking) : undefined,
        },
      };

      await immigrationService.updateImmigrationProfile(immigrationFile._id, updateData);
      toast.success("Immigration file updated successfully!");
      setIsEditing(false);
      
      // Refresh the data
      await fetchImmigrationFile();
    } catch (error) {
      console.error('Error updating immigration file:', error);
      toast.error('Failed to update immigration file');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (immigrationFile) {
      fetchImmigrationFile();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your immigration file...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Immigration File
            </h1>
            <p className="text-lg text-gray-600">
              Manage your personal information and application details
            </p>
            {immigrationFile && (
              <div className="mt-2">
                <Badge variant="outline" className="text-sm">
                  File Number: {immigrationFile.fileNumber}
                </Badge>
                <Badge variant="outline" className="ml-2 text-sm">
                  Category: {immigrationFile.category}
                </Badge>
                <Badge variant="outline" className="ml-2 text-sm">
                  Status: {immigrationFile.status}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Information
              </Button>
            )}
          </div>
        </div>

        {/* File Status */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">
                    File Status: Active
                  </h3>
                  <p className="text-gray-600">
                    Last updated: December 15, 2023
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">
                Profile Complete
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-blue-50">
            <TabsTrigger
              value="personal"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger
              value="work"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Work</span>
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Language</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Basic personal details and identification
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="font-medium text-gray-700"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="lastName"
                      className="font-medium text-gray-700"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="dateOfBirth"
                      className="font-medium text-gray-700"
                    >
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="nationality"
                      className="font-medium text-gray-700"
                    >
                      Nationality
                    </Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) =>
                        handleInputChange("nationality", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="passportNumber"
                      className="font-medium text-gray-700"
                    >
                      Passport Number
                    </Label>
                    <Input
                      id="passportNumber"
                      value={formData.passportNumber}
                      onChange={(e) =>
                        handleInputChange("passportNumber", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="maritalStatus"
                      className="font-medium text-gray-700"
                    >
                      Marital Status
                    </Label>
                    <Select
                      value={formData.maritalStatus}
                      onValueChange={(value) =>
                        handleInputChange("maritalStatus", value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1 h-12 border-gray-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription className="text-green-100">
                  Address and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="email"
                      className="font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="font-medium text-gray-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-lg text-gray-900 mb-4">
                    Address Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="address"
                        className="font-medium text-gray-700"
                      >
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={!isEditing}
                        className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor="city"
                          className="font-medium text-gray-700"
                        >
                          City
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          disabled={!isEditing}
                          className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="province"
                          className="font-medium text-gray-700"
                        >
                          Province/State
                        </Label>
                        <Input
                          id="province"
                          value={formData.province}
                          onChange={(e) =>
                            handleInputChange("province", e.target.value)
                          }
                          disabled={!isEditing}
                          className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="postalCode"
                          className="font-medium text-gray-700"
                        >
                          Postal Code
                        </Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) =>
                            handleInputChange("postalCode", e.target.value)
                          }
                          disabled={!isEditing}
                          className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education Background
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Educational qualifications and credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="highestEducation"
                      className="font-medium text-gray-700"
                    >
                      Highest Level of Education
                    </Label>
                    <Select
                      value={formData.highestEducation}
                      onValueChange={(value) =>
                        handleInputChange("highestEducation", value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1 h-12 border-gray-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Bachelor's Degree">
                          Bachelor's Degree
                        </SelectItem>
                        <SelectItem value="Master's Degree">
                          Master's Degree
                        </SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="fieldOfStudy"
                      className="font-medium text-gray-700"
                    >
                      Field of Study
                    </Label>
                    <Input
                      id="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={(e) =>
                        handleInputChange("fieldOfStudy", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="institution"
                      className="font-medium text-gray-700"
                    >
                      Institution
                    </Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) =>
                        handleInputChange("institution", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="graduationYear"
                      className="font-medium text-gray-700"
                    >
                      Graduation Year
                    </Label>
                    <Input
                      id="graduationYear"
                      value={formData.graduationYear}
                      onChange={(e) =>
                        handleInputChange("graduationYear", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Work Experience */}
          <TabsContent value="work">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Employment history and current position
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="currentJob"
                      className="font-medium text-gray-700"
                    >
                      Current Job Title
                    </Label>
                    <Input
                      id="currentJob"
                      value={formData.currentJob}
                      onChange={(e) =>
                        handleInputChange("currentJob", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="employer"
                      className="font-medium text-gray-700"
                    >
                      Current Employer
                    </Label>
                    <Input
                      id="employer"
                      value={formData.employer}
                      onChange={(e) =>
                        handleInputChange("employer", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="workExperience"
                      className="font-medium text-gray-700"
                    >
                      Years of Work Experience
                    </Label>
                    <Input
                      id="workExperience"
                      type="number"
                      value={formData.workExperience}
                      onChange={(e) =>
                        handleInputChange("workExperience", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Proficiency */}
          <TabsContent value="language">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Proficiency
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Official language test scores (IELTS, CELPIP, TEF, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-4">
                    English Proficiency
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label
                        htmlFor="englishListening"
                        className="font-medium text-gray-700"
                      >
                        Listening
                      </Label>
                      <Input
                        id="englishListening"
                        value={formData.englishListening}
                        onChange={(e) =>
                          handleInputChange("englishListening", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="0.0"
                        className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="englishReading"
                        className="font-medium text-gray-700"
                      >
                        Reading
                      </Label>
                      <Input
                        id="englishReading"
                        value={formData.englishReading}
                        onChange={(e) =>
                          handleInputChange("englishReading", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="0.0"
                        className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="englishWriting"
                        className="font-medium text-gray-700"
                      >
                        Writing
                      </Label>
                      <Input
                        id="englishWriting"
                        value={formData.englishWriting}
                        onChange={(e) =>
                          handleInputChange("englishWriting", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="0.0"
                        className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="englishSpeaking"
                        className="font-medium text-gray-700"
                      >
                        Speaking
                      </Label>
                      <Input
                        id="englishSpeaking"
                        value={formData.englishSpeaking}
                        onChange={(e) =>
                          handleInputChange("englishSpeaking", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="0.0"
                        className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-lg text-gray-900 mb-4">
                    French Proficiency (Optional)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label
                        htmlFor="frenchListening"
                        className="font-medium text-gray-700"
                      >
                        Listening
                      </Label>
                      <Input
                        id="frenchListening"
                        value={formData.frenchListening}
                        onChange={(e) =>
                          handleInputChange("frenchListening", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="0.0"
                        className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="frenchReading"
                        className="font-medium text-gray-700"
                      >
                        Reading
                      </Label>
                      <Input
                        id="frenchReading"
                        value={formData.frenchReading}
                        onChange={(e) =>
                          handleInputChange("frenchReading", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="0.0"
                        className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="frenchWriting"
                        className="font-medium text-gray-700"
                      >
                        Writing
                      </Label>
                      <Input
                        id="frenchWriting"
                        value={formData.frenchWriting}
                        onChange={(e) =>
                          handleInputChange("frenchWriting", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="0.0"
                        className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="frenchSpeaking"
                        className="font-medium text-gray-700"
                      >
                        Speaking
                      </Label>
                      <Input
                        id="frenchSpeaking"
                        value={formData.frenchSpeaking}
                        onChange={(e) =>
                          handleInputChange("frenchSpeaking", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="0.0"
                        className="mt-1 h-12 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImmigrationFile;
