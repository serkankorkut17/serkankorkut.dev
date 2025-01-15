import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TemplateSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      design: { type: String, required: true }, // JSON representation of the template
      html: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  export const Template = mongoose.models.Template || mongoose.model('Template', TemplateSchema);  