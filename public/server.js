const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Put your forms in 'public' folder

const filePath = path.join(__dirname, "all_responses.csv");

// Initialize CSV with headers if not exist
if (!fs.existsSync(filePath)) {
  const headers = [
    "FormType",
    "FullName","Age","Contact","Course","Year","Subjects",
    "Reasons","Challenges","Satisfaction","NoInfluence",
    "EnjoySubject","WeakSubject","Grades","ExtraClasses","Workload",
    "Activities","Rating_Creativity","Rating_Logical","Rating_Analytical",
    "Rating_Communication","Rating_Leadership","Rating_Empathy","Enjoy",
    "Motivation","Pref_Work","Personality","DecisionMaking",
    "Clarity","CareerInterest","Exams","FurtherStudy","TenYears",
    "ParentEducation","CareerFamilyPref","PeerPressure","FinancesLimit","Mentors",
    "ReChoose","Confusion","Support"
  ];
  fs.writeFileSync(filePath, headers.join(",") + "\n");
}

// Escape CSV values
function escapeCSV(value) {
  if (!value) return "";
  return `"${value.toString().replace(/"/g, '""')}"`;
}

// POST endpoint for all forms
app.post("/submit", (req, res) => {
  const formType = req.body.formType || "Unknown";

  // Combine all checkbox/multi-select values
  const reasons = Array.isArray(req.body.reason) ? req.body.reason.join(";") : req.body.reason || "";
  const enjoy = Array.isArray(req.body.enjoy) ? req.body.enjoy.join(";") : req.body.enjoy || "";

  const row = [
    formType,
    req.body.fullName || "",
    req.body.age || "",
    req.body.contact || "",
    req.body.course || "",
    req.body.year || "",
    req.body.subjects || "",
    reasons,
    req.body.challenge_school || "",
    req.body.satisfaction || "",
    req.body.no_influence || "",
    req.body.enjoySubject || "",
    req.body.weak_subject || "",
    req.body.grades || "",
    req.body.extra_classes || "",
    req.body.workload || "",
    req.body.activities || "",
    req.body.rating_creativity || "",
    req.body.rating_logical || "",
    req.body.rating_analytical || "",
    req.body.rating_communication || "",
    req.body.rating_leadership || "",
    req.body.rating_empathy || "",
    enjoy,
    req.body.motivation || "",
    req.body.pref_work || "",
    req.body.personality || "",
    req.body.decision_making || "",
    req.body.clarity || "",
    req.body.career_interest || "",
    req.body.exams || "",
    req.body.further_study || "",
    req.body.ten_years || "",
    req.body.parent_education || "",
    req.body.career_family_pref || "",
    req.body.peer_pressure || "",
    req.body.finances_limit || "",
    req.body.mentors || "",
    req.body.re_choose || "",
    req.body.confusion || "",
    req.body.support || ""
  ].map(escapeCSV).join(",");

  fs.appendFileSync(filePath, row + "\n");

  res.send("✅ Your response has been saved. Thank you!");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
