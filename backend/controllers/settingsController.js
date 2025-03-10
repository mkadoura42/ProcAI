const { validationResult } = require('express-validator');
const Settings = require('../models/Settings');
const crypto = require('crypto');

/**
 * Get all settings
 * @route GET /api/settings
 * @access Private/Admin
 */
exports.getAllSettings = async (req, res) => {
  try {
    // Get all settings
    const settings = await Settings.find().sort({ category: 1, key: 1 });

    // Format settings for response
    const formattedSettings = settings.map(setting => {
      // Don't return the actual value for encrypted settings
      const value = setting.isEncrypted ? null : setting.value;

      return {
        id: setting._id,
        category: setting.category,
        key: setting.key,
        value,
        description: setting.description,
        isEncrypted: setting.isEncrypted,
        isSystem: setting.isSystem,
        updatedAt: setting.updatedAt,
        updatedBy: setting.updatedBy
      };
    });

    // Group settings by category
    const groupedSettings = formattedSettings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }

      acc[setting.category].push(setting);
      return acc;
    }, {});

    res.json(groupedSettings);
  } catch (error) {
    console.error('Get all settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get settings by category
 * @route GET /api/settings/:category
 * @access Private/Admin
 */
exports.getSettingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Get settings by category
    const settings = await Settings.find({ category }).sort({ key: 1 });

    // Format settings for response
    const formattedSettings = settings.map(setting => {
      // Don't return the actual value for encrypted settings
      const value = setting.isEncrypted ? null : setting.value;

      return {
        id: setting._id,
        category: setting.category,
        key: setting.key,
        value,
        description: setting.description,
        isEncrypted: setting.isEncrypted,
        isSystem: setting.isSystem,
        updatedAt: setting.updatedAt,
        updatedBy: setting.updatedBy
      };
    });

    res.json(formattedSettings);
  } catch (error) {
    console.error('Get settings by category error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get setting by key
 * @route GET /api/settings/:category/:key
 * @access Private/Admin
 */
exports.getSettingByKey = async (req, res) => {
  try {
    const { category, key } = req.params;

    // Get setting by category and key
    const setting = await Settings.findOne({ category, key });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    // Don't return the actual value for encrypted settings
    const value = setting.isEncrypted ? null : setting.value;

    res.json({
      id: setting._id,
      category: setting.category,
      key: setting.key,
      value,
      description: setting.description,
      isEncrypted: setting.isEncrypted,
      isSystem: setting.isSystem,
      updatedAt: setting.updatedAt,
      updatedBy: setting.updatedBy
    });
  } catch (error) {
    console.error('Get setting by key error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create or update setting
 * @route PUT /api/settings/:category/:key
 * @access Private/Admin
 */
exports.updateSetting = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, key } = req.params;
  const { value, description, isEncrypted } = req.body;

  try {
    // Find setting
    let setting = await Settings.findOne({ category, key });

    // Process value based on encryption setting
    let processedValue = value;

    // If setting should be encrypted
    if (isEncrypted) {
      // Simple encryption for demo purposes
      // In a real application, use a more secure encryption method
      const cipher = crypto.createCipher('aes-256-cbc', 'procai-encryption-key');
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      processedValue = encrypted;
    }

    if (setting) {
      // Update existing setting
      setting.value = processedValue;
      if (description) setting.description = description;
      if (isEncrypted !== undefined) setting.isEncrypted = isEncrypted;
      setting.updatedBy = req.user.id;
    } else {
      // Create new setting
      setting = new Settings({
        category,
        key,
        value: processedValue,
        description: description || '',
        isEncrypted: isEncrypted || false,
        isSystem: false,
        updatedBy: req.user.id
      });
    }

    await setting.save();

    // Don't return the actual value for encrypted settings in the response
    const responseValue = setting.isEncrypted ? null : setting.value;

    res.json({
      message: 'Setting updated successfully',
      setting: {
        id: setting._id,
        category: setting.category,
        key: setting.key,
        value: responseValue,
        description: setting.description,
        isEncrypted: setting.isEncrypted,
        isSystem: setting.isSystem,
        updatedAt: setting.updatedAt,
        updatedBy: setting.updatedBy
      }
    });
  } catch (error) {
    console.error('Update setting error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete setting
 * @route DELETE /api/settings/:category/:key
 * @access Private/Admin
 */
exports.deleteSetting = async (req, res) => {
  try {
    const { category, key } = req.params;

    // Find setting
    const setting = await Settings.findOne({ category, key });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    // Don't allow deletion of system settings
    if (setting.isSystem) {
      return res.status(400).json({ message: 'Cannot delete system settings' });
    }

    await Settings.deleteOne({ category, key });

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Initialize default settings
 * @route POST /api/settings/initialize
 * @access Private/Admin
 */
exports.initializeSettings = async (req, res) => {
  try {
    // Define default settings
    const defaultSettings = [
      // General settings
      {
        category: 'general',
        key: 'company_name',
        value: 'ProcAI',
        description: 'Company name',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'general',
        key: 'application_name',
        value: 'ProcAI - Procurement AI Assistant',
        description: 'Application name',
        isEncrypted: false,
        isSystem: true
      },

      // API settings
      {
        category: 'api',
        key: 'openai_api_key',
        value: '',
        description: 'OpenAI API Key',
        isEncrypted: true,
        isSystem: true
      },
      {
        category: 'api',
        key: 'openai_organization',
        value: '',
        description: 'OpenAI Organization ID',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'api',
        key: 'deepseek_api_key',
        value: '',
        description: 'DeepSeek API Key',
        isEncrypted: true,
        isSystem: true
      },
      {
        category: 'api',
        key: 'deepseek_api_endpoint',
        value: 'https://api.deepseek.com/v1',
        description: 'DeepSeek API Endpoint',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'api',
        key: 'llama_api_key',
        value: '',
        description: 'Llama API Key',
        isEncrypted: true,
        isSystem: true
      },
      {
        category: 'api',
        key: 'llama_api_endpoint',
        value: 'https://api.llama.com/v1',
        description: 'Llama API Endpoint',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'api',
        key: 'default_ai_provider',
        value: 'openai',
        description: 'Default AI Provider (openai, deepseek, llama)',
        isEncrypted: false,
        isSystem: true
      },

      // Reference code settings
      {
        category: 'reference-codes',
        key: 'rfp_format',
        value: 'RFP-{YYYYMMDD}-{SEQ}',
        description: 'Format for RFP reference numbers',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'reference-codes',
        key: 'bid_format',
        value: 'BID-{RFP}-{YYYYMMDD}-{SEQ}',
        description: 'Format for bid reference numbers',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'reference-codes',
        key: 'report_format',
        value: 'REP-{DOC}-{YYYYMMDD}-{SEQ}',
        description: 'Format for report reference numbers',
        isEncrypted: false,
        isSystem: true
      },

      // AI agent settings
      {
        category: 'ai-agents',
        key: 'compliance-agent',
        value: {
          name: 'Compliance AI Agent',
          description: 'Analyzes documents for compliance with regulations and requirements',
          model: 'GPT-4',
          provider: 'openai',
          systemPrompt: 'You are a compliance analysis AI agent specialized in reviewing RFPs and other procurement documents.',
          temperature: 0.3,
          maxTokens: 4000,
          isActive: true
        },
        description: 'Settings for Compliance AI Agent',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'ai-agents',
        key: 'evaluation-agent',
        value: {
          name: 'Evaluation AI Agent',
          description: 'Evaluates bids against RFP requirements and scoring criteria',
          model: 'GPT-4',
          provider: 'openai',
          systemPrompt: 'You are an evaluation AI agent specialized in analyzing bids against RFP requirements.',
          temperature: 0.2,
          maxTokens: 4000,
          isActive: true
        },
        description: 'Settings for Evaluation AI Agent',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'ai-agents',
        key: 'comparative-agent',
        value: {
          name: 'Comparative AI Agent',
          description: 'Compares multiple bids to identify strengths, weaknesses, and best value',
          model: 'GPT-4',
          provider: 'openai',
          systemPrompt: 'You are a comparative analysis AI agent specialized in comparing multiple bids for an RFP.',
          temperature: 0.2,
          maxTokens: 4000,
          isActive: true
        },
        description: 'Settings for Comparative AI Agent',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'ai-models',
        key: 'available_models',
        value: [
          {
            id: 'gpt-4',
            name: 'GPT-4',
            provider: 'openai',
            description: 'OpenAI GPT-4 model',
            isActive: true
          },
          {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            provider: 'openai',
            description: 'OpenAI GPT-3.5 Turbo model',
            isActive: true
          },
          {
            id: 'deepseek-r1',
            name: 'DeepSeek R1',
            provider: 'deepseek',
            description: 'DeepSeek R1 model',
            isActive: true
          },
          {
            id: 'llama-3.3-70b',
            name: 'Llama 3.3 70B',
            provider: 'llama',
            description: 'Llama 3.3 70B model',
            isActive: true
          }
        ],
        description: 'Available AI models',
        isEncrypted: false,
        isSystem: true
      },

      // Integration settings
      {
        category: 'integrations',
        key: 'email_integration',
        value: {
          enabled: false,
          provider: 'smtp',
          host: '',
          port: 587,
          username: '',
          password: '',
          from_email: '',
          from_name: 'ProcAI'
        },
        description: 'Email integration settings',
        isEncrypted: false,
        isSystem: true
      },
      {
        category: 'integrations',
        key: 'document_storage',
        value: {
          provider: 'local',
          settings: {}
        },
        description: 'Document storage integration settings',
        isEncrypted: false,
        isSystem: true
      }
    ];

    // Create or update settings
    for (const setting of defaultSettings) {
      let existingSetting = await Settings.findOne({ category: setting.category, key: setting.key });

      if (existingSetting) {
        // Don't update value if it's already set (especially for API keys)
        if (existingSetting.value && (setting.category === 'api' || setting.isEncrypted)) {
          continue;
        }

        // Update other fields
        existingSetting.description = setting.description;
        existingSetting.isEncrypted = setting.isEncrypted;
        existingSetting.isSystem = setting.isSystem;
        existingSetting.updatedBy = req.user.id;

        // Only update value if it's not an API key or encrypted setting
        if (!(setting.category === 'api' || setting.isEncrypted)) {
          existingSetting.value = setting.value;
        }

        await existingSetting.save();
      } else {
        // Create new setting
        const newSetting = new Settings({
          category: setting.category,
          key: setting.key,
          value: setting.value,
          description: setting.description,
          isEncrypted: setting.isEncrypted,
          isSystem: setting.isSystem,
          updatedBy: req.user.id
        });

        await newSetting.save();
      }
    }

    res.json({ message: 'Default settings initialized successfully' });
  } catch (error) {
    console.error('Initialize settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get reference code settings
 * @route GET /api/settings/reference-codes
 * @access Private
 */
exports.getReferenceCodeSettings = async (req, res) => {
  try {
    // Get reference code settings
    const settings = await Settings.find({ category: 'reference-codes' });

    // Format settings for response
    const referenceCodeSettings = {};

    settings.forEach(setting => {
      referenceCodeSettings[setting.key] = setting.value;
    });

    res.json(referenceCodeSettings);
  } catch (error) {
    console.error('Get reference code settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
