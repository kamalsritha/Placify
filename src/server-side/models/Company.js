import mongoose from 'mongoose'
const CompanySchema = new mongoose.Schema({
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
    interviewType:{type: String,require:true},
    graduationCGPA: { type: Number },
    pass : {type: String, required : true},
    loc:{type:String,default:null},
    expire: { type: Date, required: true },
    created:{ type: Date, default: Date.now },
});

CompanySchema.index({ expire: 1 }, { expireAfterSeconds: 0 });

const CompanyModel = mongoose.model("Company", CompanySchema);
export {CompanyModel as Company}
