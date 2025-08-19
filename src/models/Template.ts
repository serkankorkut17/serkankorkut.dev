import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      design: { type: String, required: true },
      html: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  export const Template = mongoose.models.Template || mongoose.model('Template', TemplateSchema);  