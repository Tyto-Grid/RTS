/**
 * ═══════════════════════════════════════════════════════════════
 * STEP 1: RUN THIS ONCE — Creates your Google Form automatically
 * ═══════════════════════════════════════════════════════════════
 *
 * HOW TO USE:
 * 1. Go to https://script.google.com
 * 2. Click "New project"
 * 3. Delete everything in the editor
 * 4. Paste this ENTIRE file
 * 5. Click the Save icon — name it "Solar Vista Setup"
 * 6. In the toolbar, make sure "createInstallationForm" is selected
 * 7. Click Run
 * 8. Click "Review permissions" → your account → "Allow"
 * 9. Click "Execution log" at bottom to see output
 * 10. COPY the entire output — you need it for Step 3
 */

function createInstallationForm() {
  var form = FormApp.create("Solar Vista — Installation Record");
  form.setDescription(
    "PM Surya Ghar Muft Bijli Yojana — Installation completion record.\n" +
    "Fill this after completing each rooftop solar installation."
  );
  form.setConfirmationMessage("Installation record submitted successfully!");

  // ── Beneficiary Details ──
  form.addSectionHeaderItem().setTitle("Beneficiary Details");
  var esn = form.addTextItem().setTitle("ESN (Electrical Service Number)").setRequired(true);
  var name = form.addTextItem().setTitle("Beneficiary Name").setRequired(true);
  var aadhar = form.addTextItem().setTitle("Beneficiary Aadhar Number");
  var phone = form.addTextItem().setTitle("Beneficiary Phone Number");
  var address = form.addParagraphTextItem().setTitle("Beneficiary Address");

  // ── Location Details ──
  form.addSectionHeaderItem().setTitle("Location Details");
  var subdivision = form.addTextItem().setTitle("Subdivision");
  var section = form.addTextItem().setTitle("Section");
  var distribution = form.addTextItem().setTitle("Distribution Transformer (DT)");
  var coordinates = form.addTextItem().setTitle("GPS Coordinates / Map Link");

  // ── Vendor & Team ──
  form.addSectionHeaderItem().setTitle("Vendor & Team Details");
  var vendor = form.addTextItem().setTitle("Vendor / Subcontractor").setRequired(true);
  var teamLeader = form.addTextItem().setTitle("Team Leader Name").setRequired(true);
  var teamSize = form.addTextItem().setTitle("Team Size");

  // ── Dates ──
  form.addSectionHeaderItem().setTitle("Project Dates");
  var startDate = form.addDateItem().setTitle("Start Date");
  var completionDate = form.addDateItem().setTitle("Completion Date");

  // ── System Specifications ──
  form.addSectionHeaderItem().setTitle("System Specifications");
  var capacity = form.addTextItem().setTitle("System Capacity (kW)");
  var inverterMake = form.addTextItem().setTitle("Inverter Make");
  var inverterSerial = form.addTextItem().setTitle("Inverter Serial Number");

  // ── Panel Details ──
  form.addSectionHeaderItem().setTitle("Solar Panel Details");
  var panelMake = form.addTextItem().setTitle("Panel Make");
  var panelCapacity = form.addTextItem().setTitle("Panel Capacity (Wp)");
  var panelSerial1 = form.addTextItem().setTitle("Panel Serial No. 1");
  var panelSerial2 = form.addTextItem().setTitle("Panel Serial No. 2");
  var panelSerial3 = form.addTextItem().setTitle("Panel Serial No. 3");
  var panelSerial4 = form.addTextItem().setTitle("Panel Serial No. 4");

  // ── Net Metering ──
  form.addSectionHeaderItem().setTitle("Net Metering");
  var discomMeter = form.addMultipleChoiceItem()
    .setTitle("Installation of Meter by DISCOM")
    .setChoiceValues(["Yes", "No"]);

  // ── Completion ──
  form.addSectionHeaderItem().setTitle("Completion");
  var checklist = form.addParagraphTextItem().setTitle("Completion Checklist");
  var remarks = form.addParagraphTextItem().setTitle("Remarks");

  // ── Photo Folder (auto-filled by PWA after upload) ──
  var photoFolder = form.addTextItem().setTitle("Photo Folder Link (Auto)");

  // ── Create linked spreadsheet ──
  var ss = SpreadsheetApp.create("Solar Vista — Installation Data");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // ── Output ──
  var formUrl = form.getPublishedUrl();
  var formEditUrl = form.getEditUrl();
  var formResponseUrl = formUrl.replace("/viewform", "/formResponse");
  var sheetUrl = ss.getUrl();

  Logger.log("\n");
  Logger.log("====================================================");
  Logger.log("  FORM CREATED SUCCESSFULLY!");
  Logger.log("====================================================");
  Logger.log("\n");
  Logger.log("Form URL (to view):    " + formUrl);
  Logger.log("Form Edit URL:         " + formEditUrl);
  Logger.log("Spreadsheet URL:       " + sheetUrl);
  Logger.log("\n");
  Logger.log("====================================================");
  Logger.log("  COPY THESE VALUES INTO YOUR PWA (index.html)");
  Logger.log("====================================================");
  Logger.log("\n");
  Logger.log("FORM_URL:");
  Logger.log(formResponseUrl);
  Logger.log("\n");
  Logger.log("ENTRY IDs:");
  Logger.log("esn:             entry." + esn.getId());
  Logger.log("beneficiaryName: entry." + name.getId());
  Logger.log("aadhar:          entry." + aadhar.getId());
  Logger.log("phone:           entry." + phone.getId());
  Logger.log("address:         entry." + address.getId());
  Logger.log("subdivision:     entry." + subdivision.getId());
  Logger.log("section:         entry." + section.getId());
  Logger.log("distribution:    entry." + distribution.getId());
  Logger.log("coordinates:     entry." + coordinates.getId());
  Logger.log("vendor:          entry." + vendor.getId());
  Logger.log("teamLeader:      entry." + teamLeader.getId());
  Logger.log("teamSize:        entry." + teamSize.getId());
  Logger.log("startDate:       entry." + startDate.getId());
  Logger.log("completionDate:  entry." + completionDate.getId());
  Logger.log("capacity:        entry." + capacity.getId());
  Logger.log("inverterMake:    entry." + inverterMake.getId());
  Logger.log("inverterSerial:  entry." + inverterSerial.getId());
  Logger.log("panelMake:       entry." + panelMake.getId());
  Logger.log("panelCapacity:   entry." + panelCapacity.getId());
  Logger.log("panelSerial1:    entry." + panelSerial1.getId());
  Logger.log("panelSerial2:    entry." + panelSerial2.getId());
  Logger.log("panelSerial3:    entry." + panelSerial3.getId());
  Logger.log("panelSerial4:    entry." + panelSerial4.getId());
  Logger.log("discomMeter:     entry." + discomMeter.getId());
  Logger.log("checklist:       entry." + checklist.getId());
  Logger.log("remarks:         entry." + remarks.getId());
  Logger.log("photoFolder:     entry." + photoFolder.getId());
  Logger.log("\n");
  Logger.log("====================================================");
  Logger.log("  NEXT: Set up the Photo Upload script (Step 2)");
  Logger.log("====================================================");
}
