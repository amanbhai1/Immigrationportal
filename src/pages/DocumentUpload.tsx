import { useState, useEffect, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Plus,
  Info,
  Search,
  Filter,
  Loader2,
  X,
  Calendar,
  User,
  Clock,
  Star,
} from "lucide-react";
import immigrationService, { ImmigrationFile } from "@/services/immigrationService";
import documentService, { Document, UploadProgress } from "@/services/documentService";

interface DocumentWithStatus extends Document {
  status?: "required" | "uploaded" | "verified" | "rejected";
  category?: string;
}

const DocumentUpload = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [immigrationFile, setImmigrationFile] = useState<ImmigrationFile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedDocuments = documentService.getPredefinedDocuments();
  const categories = ["all", "Identity", "Education", "Language", "Employment", "Background", "Medical", "Financial", "Family", "Immigration", "Other"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await immigrationService.getActiveImmigrationFile();
      const file = response?.immigrationFile;
      
      if (file) {
        setImmigrationFile(file);
        setDocuments(file.documents || []);
      }
    } catch (error) {
      console.error('Error fetching immigration file:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = documentService.validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setUploadForm(prev => ({ ...prev, file }));
  };

  const handleDocumentTypeSelect = (documentType: string) => {
    const predefinedDoc = predefinedDocuments.find(doc => doc.id === documentType);
    if (predefinedDoc) {
      setUploadForm(prev => ({
        ...prev,
        title: predefinedDoc.name,
        description: predefinedDoc.description,
      }));
      setSelectedDocumentType(documentType);
    }
  };

  const handleUpload = async () => {
    if (!immigrationFile || !uploadForm.file || !uploadForm.title.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      if (uploadForm.description) {
        formData.append('description', uploadForm.description);
      }

      await immigrationService.uploadDocument(immigrationFile._id, formData);

      toast.success("Document uploaded successfully!");
      setShowUploadForm(false);
      setUploadForm({ title: "", description: "", file: null });
      setSelectedDocumentType("");
      setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
      
      await fetchData();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!immigrationFile) return;

    try {
      await immigrationService.deleteDocument(immigrationFile._id, documentId);
      toast.success("Document deleted successfully!");
      await fetchData();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "uploaded":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case "uploaded":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Uploaded</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Required</Badge>;
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getDocumentStatus = (docType: string) => {
    const uploaded = documents.find(doc => 
      doc.title.toLowerCase().includes(docType.toLowerCase()) ||
      doc.description?.toLowerCase().includes(docType.toLowerCase())
    );
    return uploaded ? "uploaded" : "required";
  };

  const filteredPredefinedDocs = predefinedDocuments.filter(doc => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const requiredDocsCount = predefinedDocuments.filter(doc => doc.required).length;
  const uploadedRequiredCount = predefinedDocuments.filter(doc => 
    doc.required && getDocumentStatus(doc.name) === "uploaded"
  ).length;
  const progressPercentage = (uploadedRequiredCount / requiredDocsCount) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your documents...</p>
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
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📁 Document Management Center
              </h1>
              <p className="text-lg text-gray-600">
                Upload and manage your immigration documents securely
              </p>
              {immigrationFile && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-sm">
                    📋 File: {immigrationFile.fileNumber}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    📊 Category: {immigrationFile.category}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    📈 Status: {immigrationFile.status}
                  </Badge>
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowUploadForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2 h-12 px-6"
            >
              <Plus className="h-5 w-5" />
              Upload New Document
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Document Progress
                  </h3>
                  <p className="text-lg text-gray-600">
                    {uploadedRequiredCount} of {requiredDocsCount} required documents uploaded
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="bg-green-100 text-green-800">
                      {documents.length} Total Uploaded
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      {requiredDocsCount - uploadedRequiredCount} Remaining
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Math.round(progressPercentage)}%
                </div>
                <Progress
                  value={progressPercentage}
                  className="w-full lg:w-48 h-3 mb-2"
                />
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>📋 Upload Guidelines:</strong> All documents must be clear and legible. 
            Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG. Maximum file size: 10MB per document.
            Translations must be certified if documents are not in English or French.
          </AlertDescription>
        </Alert>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter by:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`capitalize ${
                  selectedCategory === category 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "border-blue-200 hover:bg-blue-50"
                }`}
              >
                {category}
                {category !== "all" && (
                  <Badge variant="secondary" className="ml-2 bg-white/20">
                    {predefinedDocuments.filter((doc) => doc.category === category).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="required" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-blue-50">
            <TabsTrigger
              value="required"
              className="py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              📋 Required Documents ({requiredDocsCount})
            </TabsTrigger>
            <TabsTrigger
              value="uploaded"
              className="py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              📁 Uploaded Documents ({documents.length})
            </TabsTrigger>
          </TabsList>

          {/* Required Documents Tab */}
          <TabsContent value="required" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPredefinedDocs.map((docType) => {
                const status = getDocumentStatus(docType.name);
                const uploadedDoc = documents.find(doc => 
                  doc.title.toLowerCase().includes(docType.name.toLowerCase())
                );

                return (
                  <Card
                    key={docType.id}
                    className={`border-0 shadow-lg transition-all duration-200 hover:shadow-xl ${
                      status === "uploaded" 
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" 
                        : docType.required 
                          ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
                          : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{docType.icon}</div>
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-tight text-gray-900 flex items-center gap-2">
                              {docType.name}
                              {docType.required && (
                                <Star className="h-4 w-4 text-orange-500" />
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1 text-gray-600">
                              {docType.description}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(status)}
                      </div>
                      <Badge
                        variant="outline"
                        className="w-fit text-xs text-blue-600 border-blue-200"
                      >
                        {docType.category}
                      </Badge>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {status === "required" ? (
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                            <Upload className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Ready to upload
                            </p>
                            <p className="text-xs text-gray-500">
                              Click below to select file
                            </p>
                          </div>
                          <Button
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white h-11"
                            onClick={() => {
                              handleDocumentTypeSelect(docType.id);
                              setShowUploadForm(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Upload {docType.name}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {uploadedDoc?.title}
                              </p>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {uploadedDoc?.uploadedAt ? new Date(uploadedDoc.uploadedAt).toLocaleDateString() : 'Recently'}
                              </p>
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Uploaded
                              </Badge>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-blue-200 hover:bg-blue-50"
                              onClick={() => uploadedDoc && setViewingDocument(uploadedDoc)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-red-200 hover:bg-red-50 text-red-600"
                              onClick={() => uploadedDoc && handleDelete(uploadedDoc._id!)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Uploaded Documents Tab */}
          <TabsContent value="uploaded" className="space-y-6">
            {filteredDocuments.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No documents uploaded yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by uploading your required immigration documents
                  </p>
                  <Button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload First Document
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <Card
                    key={document._id}
                    className="border-0 shadow-lg transition-all duration-200 hover:shadow-xl bg-gradient-to-br from-white to-gray-50"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">
                            {documentService.getFileTypeIcon(document.fileType || '')}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-tight text-gray-900">
                              {document.title}
                            </CardTitle>
                            {document.description && (
                              <CardDescription className="mt-1 text-gray-600">
                                {document.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Uploaded
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Recently'}
                        <Clock className="h-3 w-3 ml-2" />
                        {document.uploadedAt ? new Date(document.uploadedAt).toLocaleTimeString() : 'Now'}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-blue-200 hover:bg-blue-50"
                          onClick={() => setViewingDocument(document)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 hover:bg-green-50 text-green-600"
                          onClick={() => {
                            const link = window.document.createElement('a');
                            link.href = `http://localhost:5000${document.fileUrl}`;
                            link.download = document.title;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 hover:bg-red-50 text-red-600"
                          onClick={() => handleDelete(document._id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">📤 Upload Document</CardTitle>
                    <CardDescription>
                      Add a new document to your immigration file
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowUploadForm(false);
                      setSelectedDocumentType("");
                      setUploadForm({ title: "", description: "", file: null });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Type Selection */}
                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={selectedDocumentType} onValueChange={handleDocumentTypeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedDocuments.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          <div className="flex items-center gap-2">
                            <span>{doc.icon}</span>
                            <span>{doc.name}</span>
                            {doc.required && <Star className="h-3 w-3 text-orange-500" />}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Document Title *</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Passport Copy"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description or notes about this document"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="file">Select File *</Label>
                  <Input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="cursor-pointer"
                  />
                  {uploadForm.file && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {documentService.getFileTypeIcon(uploadForm.file.type)}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{uploadForm.file.name}</p>
                          <p className="text-sm text-gray-600">
                            {documentService.formatFileSize(uploadForm.file.size)}
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress.percentage}%</span>
                    </div>
                    <Progress value={uploadProgress.percentage} className="h-2" />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowUploadForm(false);
                      setSelectedDocumentType("");
                      setUploadForm({ title: "", description: "", file: null });
                    }}
                    disabled={uploading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !uploadForm.file || !uploadForm.title.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Document Viewer Modal */}
        {viewingDocument && (
          <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-xl">
                    {documentService.getFileTypeIcon(viewingDocument.fileType || '')}
                  </span>
                  {viewingDocument.title}
                </DialogTitle>
                <DialogDescription>
                  {viewingDocument.description || 'Document preview'}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                {viewingDocument.fileType?.includes('pdf') ? (
                  <iframe
                    src={`http://localhost:5000${viewingDocument.fileUrl}`}
                    className="w-full h-[70vh] border rounded-lg"
                    title={viewingDocument.title}
                  />
                ) : viewingDocument.fileType?.includes('image') ? (
                  <img
                    src={`http://localhost:5000${viewingDocument.fileUrl}`}
                    alt={viewingDocument.title}
                    className="w-full h-[70vh] object-contain border rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[70vh] bg-gray-50 border rounded-lg">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                      <Button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `http://localhost:5000${viewingDocument.fileUrl}`;
                          link.download = viewingDocument.title;
                          link.click();
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
