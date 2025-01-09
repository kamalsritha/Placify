import mongoose from "mongoose";

const CompanyDataSchema = new mongoose.Schema({
  name: { type: String, required: true },  
});

const CompanyDataModel = mongoose.model("CompanyData", CompanyDataSchema);
export { CompanyDataModel as CompanyData };
