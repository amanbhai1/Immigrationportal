import ImmigrationFile from '../models/immigrationFileModel.js';

// Calculate CRS score based on form data
const calculateCRSScore = (formData) => {
  let totalScore = 0;
  let breakdown = {
    coreFactors: 0,
    spouseFactors: 0,
    additionalPoints: 0,
    total: 0
  };

  // Age points (up to 110 points)
  let agePoints = 0;
  if (formData.age >= 20 && formData.age <= 29) agePoints = 110;
  else if (formData.age >= 30 && formData.age <= 31) agePoints = 105;
  else if (formData.age >= 32 && formData.age <= 35) agePoints = 100;
  else if (formData.age >= 36 && formData.age <= 39) agePoints = 90;
  else if (formData.age >= 40 && formData.age <= 45) agePoints = 80;
  else if (formData.age >= 46 && formData.age <= 47) agePoints = 70;
  
  breakdown.coreFactors += agePoints;

  // Education points (up to 150 points)
  const educationPoints = {
    'secondary': 30,
    'certificate': 90,
    'diploma': 98,
    'bachelor': 120,
    'master': 135,
    'phd': 150,
  };
  const eduPoints = educationPoints[formData.education] || 0;
  breakdown.coreFactors += eduPoints;

  // Language points (up to 136 points for English)
  const englishCLB = Math.min(
    Math.floor(formData.englishListening || 0),
    Math.floor(formData.englishReading || 0),
    Math.floor(formData.englishWriting || 0),
    Math.floor(formData.englishSpeaking || 0)
  );

  let languagePoints = 0;
  if (englishCLB >= 9) languagePoints = 136;
  else if (englishCLB >= 8) languagePoints = 124;
  else if (englishCLB >= 7) languagePoints = 110;
  else if (englishCLB >= 6) languagePoints = 88;
  else if (englishCLB >= 5) languagePoints = 68;
  else if (englishCLB >= 4) languagePoints = 32;
  
  breakdown.coreFactors += languagePoints;

  // Work experience points (up to 80 points)
  let workExpPoints = 0;
  if (formData.workExperience >= 6) workExpPoints = 80;
  else if (formData.workExperience >= 4) workExpPoints = 70;
  else if (formData.workExperience >= 2) workExpPoints = 60;
  else if (formData.workExperience >= 1) workExpPoints = 40;
  
  breakdown.coreFactors += workExpPoints;

  // Spouse factors (if applicable)
  if (formData.hasSpouse && formData.spouseEducation) {
    const spouseEducationPoints = {
      'secondary': 2,
      'certificate': 6,
      'diploma': 7,
      'bachelor': 8,
      'master': 10,
      'phd': 10,
    };
    breakdown.spouseFactors += spouseEducationPoints[formData.spouseEducation] || 0;

    if (formData.spouseEnglishListening && formData.spouseEnglishReading && 
        formData.spouseEnglishWriting && formData.spouseEnglishSpeaking) {
      const spouseEnglishCLB = Math.min(
        Math.floor(formData.spouseEnglishListening),
        Math.floor(formData.spouseEnglishReading),
        Math.floor(formData.spouseEnglishWriting),
        Math.floor(formData.spouseEnglishSpeaking)
      );

      if (spouseEnglishCLB >= 9) breakdown.spouseFactors += 20;
      else if (spouseEnglishCLB >= 7) breakdown.spouseFactors += 16;
      else if (spouseEnglishCLB >= 5) breakdown.spouseFactors += 8;
    }

    if (formData.spouseWorkExperience) {
      if (formData.spouseWorkExperience >= 5) breakdown.spouseFactors += 10;
      else if (formData.spouseWorkExperience >= 3) breakdown.spouseFactors += 8;
      else if (formData.spouseWorkExperience >= 1) breakdown.spouseFactors += 5;
    }
  }

  // Additional points
  if (formData.jobOffer) breakdown.additionalPoints += 50;
  if (formData.provincialNomination) breakdown.additionalPoints += 600;
  if (formData.siblingInCanada) breakdown.additionalPoints += 15;

  breakdown.total = breakdown.coreFactors + breakdown.spouseFactors + breakdown.additionalPoints;
  totalScore = Math.min(breakdown.total, 1200); // Cap at maximum possible score

  return { score: totalScore, breakdown };
};

// @desc    Get current CRS score
// @route   GET /api/crs
// @access  Private
const getCurrentCRSScore = async (req, res) => {
  try {
    const immigrationFile = await ImmigrationFile.findOne({ 
      userId: req.user._id,
      isActive: true
    });

    if (!immigrationFile) {
      return res.status(404).json({
        success: false,
        message: 'No active immigration file found',
      });
    }

    res.json({
      success: true,
      currentScore: immigrationFile.CRSScore || 0,
      lastUpdated: immigrationFile.updatedAt,
      formData: immigrationFile.crsFormData || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Calculate and save CRS score
// @route   POST /api/crs
// @access  Private
const calculateAndSaveCRSScore = async (req, res) => {
  try {
    const formData = req.body;

    // Validate required fields
    if (!formData.age || !formData.education || formData.workExperience === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Age, education, and work experience are required',
      });
    }

    const immigrationFile = await ImmigrationFile.findOne({ 
      userId: req.user._id,
      isActive: true
    });

    if (!immigrationFile) {
      return res.status(404).json({
        success: false,
        message: 'No active immigration file found',
      });
    }

    // Calculate CRS score
    const { score, breakdown } = calculateCRSScore(formData);

    // Save to immigration file
    immigrationFile.CRSScore = score;
    immigrationFile.crsFormData = formData;
    await immigrationFile.save();

    res.json({
      success: true,
      CRSScore: score,
      breakdown,
      message: 'CRS score calculated and saved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update CRS score
// @route   PUT /api/crs
// @access  Private
const updateCRSScore = async (req, res) => {
  try {
    const formData = req.body;

    // Validate required fields
    if (!formData.age || !formData.education || formData.workExperience === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Age, education, and work experience are required',
      });
    }

    const immigrationFile = await ImmigrationFile.findOne({ 
      userId: req.user._id,
      isActive: true
    });

    if (!immigrationFile) {
      return res.status(404).json({
        success: false,
        message: 'No active immigration file found',
      });
    }

    // Calculate CRS score
    const { score, breakdown } = calculateCRSScore(formData);

    // Update immigration file
    immigrationFile.CRSScore = score;
    immigrationFile.crsFormData = formData;
    await immigrationFile.save();

    res.json({
      success: true,
      CRSScore: score,
      breakdown,
      message: 'CRS score updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getCurrentCRSScore,
  calculateAndSaveCRSScore,
  updateCRSScore
};