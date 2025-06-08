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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  Target,
  Award,
  Upload,
  CheckSquare,
} from "lucide-react";
import checklistService, { ChecklistItem } from "@/services/checklistService";

const ChecklistNew = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileId, setFileId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    dueDate: "",
    notes: "",
  });

  // Load checklist items on component mount
  useEffect(() => {
    loadChecklistItems();
  }, []);

  const loadChecklistItems = async () => {
    try {
      setLoading(true);
      const response = await checklistService.getChecklistItems();
      if (response.success) {
        setItems(response.checklist || []);
        setFileId(response.fileId);
      }
    } catch (error) {
      console.error("Error loading checklist items:", error);
      toast.error("Failed to load checklist items");
    } finally {
      setLoading(false);
    }
  };

  const toggleItemStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      const response = await checklistService.toggleChecklistItem(
        fileId,
        itemId,
        !currentStatus
      );
      if (response.success) {
        setItems(response.checklist || []);
        toast.success(
          !currentStatus
            ? "Item marked as completed!"
            : "Item marked as pending"
        );
      }
    } catch (error) {
      console.error("Error toggling item status:", error);
      toast.error("Failed to update item status");
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const itemData = {
        ...newItem,
        dueDate: newItem.dueDate ? new Date(newItem.dueDate) : undefined,
      };
      
      const response = await checklistService.addChecklistItem(fileId, {
        ...itemData,
        dueDate: itemData.dueDate?.toISOString() || ''
      });
      if (response.success) {
        setItems(response.checklist || []);
        setIsAddDialogOpen(false);
        setNewItem({ title: "", description: "", dueDate: "", notes: "" });
        toast.success("Checklist item added successfully!");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add checklist item");
    }
  };

  const handleEditItem = async () => {
    if (!editingItem || !editingItem.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const response = await checklistService.updateChecklistItem(
        fileId,
        editingItem._id,
        {
          title: editingItem.title,
          description: editingItem.description,
          dueDate: editingItem.dueDate ? new Date(editingItem.dueDate).toISOString() : undefined,
          notes: editingItem.notes,
        }
      );
      if (response.success) {
        setItems(response.checklist || []);
        setIsEditDialogOpen(false);
        setEditingItem(null);
        toast.success("Checklist item updated successfully!");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update checklist item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await checklistService.deleteChecklistItem(fileId, itemId);
      if (response.success) {
        setItems(response.checklist || []);
        toast.success("Checklist item deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete checklist item");
    }
  };

  const getCompletionStats = () => {
    const completed = items.filter((item) => item.isCompleted).length;
    const total = items.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, percentage };
  };

  const getStatusIcon = (isCompleted: boolean) => {
    return isCompleted ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <Clock className="h-5 w-5 text-orange-600" />
    );
  };

  const getStatusBadge = (isCompleted: boolean) => {
    return isCompleted ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Completed
      </Badge>
    ) : (
      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
        Pending
      </Badge>
    );
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = getCompletionStats();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                <CheckSquare className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
              </div>
              <p className="text-gray-600 font-medium">Loading your checklist...</p>
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
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <CheckSquare className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold">
                          Immigration Checklist
                        </h1>
                        <p className="text-blue-100 text-lg">
                          Track your progress through the immigration process
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6 lg:mt-0">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl transition-all duration-300">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-2xl rounded-2xl max-w-md">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-blue-600" />
                    Add New Checklist Item
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Create a new item to track in your immigration checklist.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title *</Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) =>
                        setNewItem({ ...newItem, title: e.target.value })
                      }
                      placeholder="Enter item title"
                      className="h-11 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      placeholder="Enter item description"
                      className="min-h-[80px] border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newItem.dueDate}
                      onChange={(e) =>
                        setNewItem({ ...newItem, dueDate: e.target.value })
                      }
                      className="h-11 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newItem.notes}
                      onChange={(e) =>
                        setNewItem({ ...newItem, notes: e.target.value })
                      }
                      placeholder="Additional notes"
                      className="min-h-[80px] border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddItem}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-300"
                  >
                    Add Item
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Target className="h-6 w-6 mr-3 text-blue-600" />
                  Overall Progress
                </h3>
                <p className="text-lg text-gray-600">
                  {stats.completed} of {stats.total} items completed
                </p>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {Math.round(stats.percentage)}%
                </div>
                <Progress
                  value={stats.percentage}
                  className="w-full lg:w-64 h-4 mb-2"
                />
                <div className="text-sm text-gray-600 font-medium">Complete</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl inline-flex mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {items.filter((i) => i.isCompleted).length}
                  </div>
                  <div className="text-sm font-medium text-green-700">
                    Completed
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl inline-flex mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {items.filter((i) => !i.isCompleted).length}
                  </div>
                  <div className="text-sm font-medium text-orange-700">
                    Pending
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl inline-flex mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {stats.total}
                  </div>
                  <div className="text-sm font-medium text-blue-700">
                    Total Items
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search checklist items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-0 bg-gray-50/50 rounded-xl text-base focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Checklist Items */}
        <div className="space-y-6">
          {filteredItems.length === 0 ? (
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-2xl inline-flex mb-6">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No checklist items found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? "No items match your search criteria. Try adjusting your search terms."
                    : "Get started by adding your first checklist item to track your immigration progress."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-8 py-3"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add First Item
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card
                key={item._id}
                className={`border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group ${
                  item.isCompleted ? "ring-2 ring-green-200/50" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Checkbox
                        checked={item.isCompleted}
                        onCheckedChange={() =>
                          toggleItemStatus(item._id, item.isCompleted)
                        }
                        className="h-5 w-5 rounded-lg data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-lg font-semibold transition-all duration-300 ${
                              item.isCompleted
                                ? "text-gray-500 line-through"
                                : "text-gray-900 group-hover:text-blue-600"
                            }`}
                          >
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className={`mt-2 text-sm ${
                              item.isCompleted ? "text-gray-400" : "text-gray-600"
                            }`}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getStatusBadge(item.isCompleted)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingItem({
                                ...item,
                                dueDate: item.dueDate
                                  ? new Date(item.dueDate)
                                      .toISOString()
                                      .split("T")[0]
                                  : "",
                              });
                              setIsEditDialogOpen(true);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item._id)}
                            className="hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {formatDate(item.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.isCompleted)}
                          <span className={`text-sm font-medium ${
                            item.isCompleted ? "text-green-600" : "text-orange-600"
                          }`}>
                            {item.isCompleted ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
                          <p className="text-sm text-gray-700 leading-relaxed">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-2xl rounded-2xl max-w-md">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Edit className="h-5 w-5 mr-2 text-blue-600" />
                Edit Checklist Item
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the details of your checklist item.
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">Title *</Label>
                  <Input
                    id="edit-title"
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    placeholder="Enter item title"
                    className="h-11 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingItem.description || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter item description"
                    className="min-h-[80px] border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate" className="text-sm font-medium text-gray-700">Due Date</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={editingItem.dueDate || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        dueDate: e.target.value,
                      })
                    }
                    className="h-11 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes" className="text-sm font-medium text-gray-700">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingItem.notes || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, notes: e.target.value })
                    }
                    placeholder="Additional notes"
                    className="min-h-[80px] border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            )}
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditItem}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-300"
              >
                Update Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChecklistNew;