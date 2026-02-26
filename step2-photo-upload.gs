/**
 * ═══════════════════════════════════════════════════════════════
 * STEP 2: PHOTO UPLOAD SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * FOLDER STRUCTURE:
 *   Solar Vista Photos (root)
 *     └── DT_TransformerName
 *           └── ESN_1234567890
 *                 ├── beneficiary_photo_1.jpg
 *                 ├── beneficiary_photo_2.jpg
 *                 ├── inverter_serial_SEL2024XX.jpg
 *                 ├── panel1_serial_RNW540XX.jpg
 *                 ├── panel2_serial_RNW540XX.jpg
 *                 ├── panel3_serial_RNW540XX.jpg
 *                 └── panel4_serial_RNW540XX.jpg
 *
 * BILLING ENGINEER ACCESS:
 *   - Each ESN folder is set to "Anyone with the link can view"
 *   - The folder URL is returned to the PWA and saved in Google Sheets
 *   - Billing engineer clicks the link in the sheet → sees all photos
 *
 * HOW TO USE:
 * 1. Go to https://script.google.com → New project
 * 2. Delete everything → Paste this entire file
 * 3. Update CONFIG below with your folder ID
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL → paste into index.html
 *
 * HOW TO GET FOLDER ID:
 * 1. Go to Google Drive → Create folder "Solar Vista Photos"
 * 2. Open it → copy ID from URL: drive.google.com/drive/folders/THIS_IS_THE_ID
 */

// ╔═══════════════════════════════════════════════╗
// ║  PASTE YOUR FOLDER ID BELOW                   ║
// ╚═══════════════════════════════════════════════╝
var CONFIG = {
  ROOT_FOLDER_ID: "PASTE_YOUR_FOLDER_ID_HERE",
};

// ── Don't change anything below ─────────────────

function doGet(e) {
  return respond({ status: "ok", service: "Solar Vista Photo Upload v2" });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (!data.esn || !data.photos || !Array.isArray(data.photos)) {
      return respond({ success: false, error: "Missing esn or photos" });
    }

    var rootFolder = DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);

    // ── Create DT folder (or "Unassigned" if no DT provided) ──
    var dtName = data.distribution
      ? "DT_" + data.distribution.replace(/[^a-zA-Z0-9_\- ]/g, "").trim()
      : "DT_Unassigned";
    var dtFolder = getOrCreateFolder(rootFolder, dtName);

    // ── Create ESN subfolder ──
    var esnName = "ESN_" + data.esn.replace(/[^a-zA-Z0-9_\-]/g, "_");
    var esnFolder = getOrCreateFolder(dtFolder, esnName);

    // ── Make ESN folder viewable by anyone with link ──
    try {
      esnFolder.setSharing(
        DriveApp.Access.ANYONE_WITH_LINK,
        DriveApp.Permission.VIEW
      );
    } catch (shareErr) {
      // Some orgs block this — continue anyway
    }

    // ── Process each photo ──
    var results = [];
    for (var i = 0; i < data.photos.length; i++) {
      var photo = data.photos[i];
      if (!photo.base64 || !photo.fieldName) continue;

      try {
        var decoded = Utilities.base64Decode(photo.base64);
        var ts = Utilities.formatDate(new Date(), "Asia/Kolkata", "HHmmss");
        var serial = photo.serialNumber
          ? "_" + photo.serialNumber.replace(/[^a-zA-Z0-9_\-]/g, "")
          : "";
        var fileName = photo.fieldName + serial + "_" + ts + ".jpg";

        var blob = Utilities.newBlob(decoded, photo.mimeType || "image/jpeg", fileName);
        var file = esnFolder.createFile(blob);

        // Add description to each photo
        var desc = [
          "ESN: " + data.esn,
          "Beneficiary: " + (data.beneficiaryName || "N/A"),
          "DT: " + (data.distribution || "N/A"),
          "Field: " + photo.fieldName,
          "Serial: " + (photo.serialNumber || "N/A"),
          "Uploaded: " + new Date().toISOString(),
        ].join("\n");
        file.setDescription(desc);

        results.push({
          fieldName: photo.fieldName,
          success: true,
          fileUrl: file.getUrl(),
        });
      } catch (photoErr) {
        results.push({
          fieldName: photo.fieldName,
          success: false,
          error: photoErr.message,
        });
      }
    }

    // ── Return folder URL (this goes into the Google Sheet) ──
    return respond({
      success: true,
      esn: data.esn,
      dt: dtName,
      folderPath: dtName + " / " + esnName,
      folderUrl: esnFolder.getUrl(),
      uploads: results,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    return respond({ success: false, error: err.message });
  }
}

function getOrCreateFolder(parent, name) {
  var folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
