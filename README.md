Info: I'm Liin, Tên thật của tôi là Hồ Ngọc Khánh,
Đây là dự án được lên kế hoạch khi tôi đang còn trong quân đội nhập ngũ năm 2024-2026, các đồng hữu có
thể lấy đọc và nghiên cứu kế hoạch học tập của mình. Kiến thức tôi còn hạn chế mong đừng chê cười.

Dự án này nhằm mục đích để cho những người nhà của đồng thân lương hữu của tôi được và có thể đăng ký
thăm gặp đồng đội khi đang nhập ngũ, và cũng có thể trao đổi thông tin nhanh chóng cho mọi người biết được
chúng tôi đã và đang làm được những gì trong Quân đội, tuy khó khăn trùng trùng nhưng chúng tôi luôn có
một tinh thần lạc quan và vui vẻ; và sẽ cống hiến hết sức mình vì quê hương, đất nước chúng tôi được sinh ra
và lớn lên. Trân trọng cảm ơn! Tái bút: Liin.

API
Database: apps script Excel
Language: HTML/CSS/JS

=================================================================
DB apps script : [doc.](https://docs.google.com/spreadsheets/u/0/)
=================================================================
function doGet(e) {
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; // sheet đầu tiên
var duLieu = sheet.getDataRange().getValues();

var ketQua = [];
for (var i = 1; i < duLieu.length; i++) {
ketQua.push({
visitCode: duLieu[i][0],
hoten: duLieu[i][1],
cccd: duLieu[i][2],
quanhe: duLieu[i][3],
quannhan: duLieu[i][4],
sdt: duLieu[i][5],
tinhthanhpho: duLieu[i][6],
xahuyen: duLieu[i][7],
donvi: duLieu[i][8],
trangthai: duLieu[i][9] || "đăng ký",
ngaytham: duLieu[i][10] || formatDate(),
thoigian: duLieu[i][11]
});
}

return ContentService.createTextOutput(JSON.stringify(ketQua))
.setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
/\*_Manager Application_/
var jsonData = JSON.parse(e.postData.contents);

switch (jsonData.indexGUI) {
case "login":
managerAccount(e, jsonData);
break;
case "manager":
CRUD_Database(e, jsonData);
break;
default:
//code here
break;
}

}

function managerAccount(e, jsonData){

}

/\*\*

- \*/
  function CRUD_Database(e, jsonData) {
  var sheetDatabase = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var dataUpload = jsonData;

var lastRow = sheetDatabase.getLastRow();
var visitCodeCol = 1; // cột A
var trangThaiCol = 10; // cột J

var visitCode = String(dataUpload.visitCode).trim();

// ===== CHƯA CÓ DỮ LIỆU =====
if (lastRow < 2 && dataUpload.action !== "add") {
return ContentService.createTextOutput(
JSON.stringify({ error: "Sheet chưa có dữ liệu" })
).setMimeType(ContentService.MimeType.JSON);
}

// ===== LẤY visitCode =====
var visitCodes = [];
if (lastRow >= 2) {
visitCodes = sheetDatabase
.getRange(2, visitCodeCol, lastRow - 1, 1)
.getValues()
.map(r => String(r[0]).trim());
}

var index = visitCodes.indexOf(visitCode);

// ================= UPDATE =================
if (dataUpload.action === "update") {
if (index === -1) {
return ContentService.createTextOutput(
JSON.stringify({ error: "Không tìm thấy visitCode" })
).setMimeType(ContentService.MimeType.JSON);
}

    sheetDatabase.getRange(index + 2, trangThaiCol)
      .setValue(dataUpload.trangthai);

    // ================= DELETE =================

} else if (dataUpload.action === "delete") {
if (index === -1) {
return ContentService.createTextOutput(
JSON.stringify({ error: "Không tìm thấy visitCode" })
).setMimeType(ContentService.MimeType.JSON);
}

    sheetDatabase.deleteRow(index + 2);

    // ================= ADD NEW =================

} else {
// Thêm 1 dòng mới ngay dưới header
sheetDatabase.insertRowBefore(2);

    // Ghi dữ liệu vào dòng 2
    sheetDatabase.getRange(2, 1, 1, 12).setValues([[
      dataUpload.visitCode,
      dataUpload.hoten,
      dataUpload.cccd,
      dataUpload.quanhe,
      dataUpload.quannhan,
      dataUpload.sdt,
      dataUpload.tinhthanhpho,
      dataUpload.xahuyen,
      dataUpload.donvi,
      dataUpload.trangthai || "đăng ký",
      dataUpload.ngaytham || formatDate(),
      dataUpload.thoigian || formatDate()
    ]]);

}

return ContentService.createTextOutput(
JSON.stringify({ status: "ok" })
).setMimeType(ContentService.MimeType.JSON);
}

function formatDate() {
var d = new Date();
var dd = ("0" + d.getDate()).slice(-2);
var mm = ("0" + (d.getMonth() + 1)).slice(-2);
var yyyy = d.getFullYear();
var hh = ("0" + d.getHours()).slice(-2);
var min = ("0" + d.getMinutes()).slice(-2);

return dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min;
}
