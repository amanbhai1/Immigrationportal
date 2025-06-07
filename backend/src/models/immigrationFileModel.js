import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  nationality: String,
  passportNumber: String,
  maritalStatus: String,
});

const contactInfoSchema = new mongoose.Schema({
  email: String,
  phone: String,
  address: String,
  city: String,
  province: String,
  postalCode: String,
  country: String,
});

const educationSchema = new mongoose.Schema({
  highestEducation: String,
  fieldOfStudy: String,
  institution: String,
  graduationYear: String,
});

const workExperienceSchema = new mongoose.Schema({
  currentJob: String,
  employer: String,
  workExperience: String,
});

const languageProficiencySchema = new mongoose.Schema({
  englishListening: Number,
  englishReading: Number,
  englishWriting: Number,
  englishSpeaking: Number,
  frenchListening: Number,
  frenchReading: Number,
  frenchWriting: Number,
  frenchSpeaking: Number,
});

const crsFormDataSchema = new mongoose.Schema({
  age: Number,
  education: String,
  workExperience: Number,
  englishListening: Number,
  englishReading: Number,
  englishWriting: Number,
  englishSpeaking: Number,
  provincialNomination: Boolean,
  jobOffer: Boolean,
  siblingInCanada: Boolean,
  hasSpouse: Boolean,
  spouseEducation: String,
  spouseWorkExperience: Number,
  spouseEnglishListening: Number,
  spouseEnglishReading: Number,
  spouseEnglishWriting: Number,
  spouseEnglishSpeaking: Number,
});

const checklistItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    isCompleted: { type: Boolean, default: false },
    dueDate: Date,
    notes: String,
  },
  { _id: true, timestamps: true }
);

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    fileUrl: { type: String, required: true },
    fileType: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const immigrationFileSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    fileNumber: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Express Entry',
        'Study Permit',
        'Work Permit',
        'Family Sponsorship',
        'Visitor Visa',
        'Citizenship',
        'Other',
      ],
    },
    personalInfo: personalInfoSchema,
    contactInfo: contactInfoSchema,
    education: educationSchema,
    workExperience: workExperienceSchema,
    languageProficiency: languageProficiencySchema,
    crsFormData: crsFormDataSchema,
    CRSScore: { type: Number, min: 0, max: 1200, default: 0 },
    status: {
      type: String,
      enum: [
        'New',
        'In Progress',
        'Pending Documentation',
        'Submitted',
        'Under Review',
        'Approved',
        'Rejected',
        'Closed',
      ],
      default: 'New',
    },
    submissionDate: Date,
    decisionDate: Date,
    checklist: [checklistItemSchema],
    documents: [documentSchema],
    notes: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ImmigrationFile = mongoose.model('ImmigrationFile', immigrationFileSchema);
export default ImmigrationFile;