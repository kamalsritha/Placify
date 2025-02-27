import mongoose from "mongoose";

const CompanyDataSchema = new mongoose.Schema({
  companyname: { type: String, required: true },
  jobprofile: { type: String, required: true},
  jobdescription: { type: String, required: true },
  website: { type: String, required: true},
  ctc: { type: Number, required: true },
  doa: { type: String,required: true},
  doi: { type: String,required: true},
  eligibilityCriteria: [{ type: String }],
  tenthPercentage: { type: Number, required: true },
  twelfthPercentage: { type: Number, required: true },
  graduationCGPA: { type: Number },
  pass : {type: String, required : true},
  loc:{type:String, default:null},
  expire: { type: Date, required: true },
  created:{ type: Date, default: Date.now },
  eligible:{type:Array,default:[]},
  applicants:{type:Array,default:[]},
  assesmentSelects:{type: Array, default:[]},
  interviewSelects:{type:Array,default:[]},
  finalSelects:{type:Array,default:[]},
  labs:{type:Boolean,default:false},
});

const CompanyDataModel = mongoose.model("CompanyData", CompanyDataSchema);
export { CompanyDataModel as CompanyData };
