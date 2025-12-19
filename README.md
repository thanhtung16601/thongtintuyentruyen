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
var jsonData = JSON.parse(e.postData.contents);
var result;

// Checking role
if(!security_Database(e)){
return jsonResponse({ error: "Page does't exsit!" });
}

switch (jsonData.indexGUI) {
case "manager":
result = CRUD_Database(jsonData);
break;
default:
result = { error: "Invalid indexGUI" };
}

return jsonResponse(result);
}

function security_Database(e) {
const body = JSON.parse(e.postData.contents);

if (body.action === "login") {
if (body.user === "admin" && body.pass === "123") {
const token = Utilities.getUuid();

      // lưu token (demo: Cache 30 phút)
      CacheService.getScriptCache().put(
        token,
        JSON.stringify({ role: "admin" }),
        1800
      );

      return json({ ok: true, token });
    }

    return json({ ok: false });

}

if (body.action === "verify") {
const cache = CacheService.getScriptCache().get(body.token);
if (!cache) return json({ ok: false });

    const data = JSON.parse(cache);
    return json({ ok: true, role: data.role });

}
}

function CRUD_Database(dataUpload) {
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

var lastRow = sheet.getLastRow();
var visitCodeCol = 1;
var trangThaiCol = 10;

var visitCode = String(dataUpload.visitCode || "").trim();

// ADD
if (dataUpload.action === "create") {
sheet.insertRowBefore(2);

    sheet.getRange(2, 1, 1, 12).setValues([[
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

    return { status: "created" };

}

// Lấy visitCode list
if (lastRow < 2) return { error: "Sheet trống" };

var visitCodes = sheet
.getRange(2, visitCodeCol, lastRow - 1, 1)
.getValues()
.map(r => String(r[0]).trim());

var index = visitCodes.indexOf(visitCode);

if (index === -1) return { error: "Không tìm thấy visitCode" };

// UPDATE
if (dataUpload.action === "update") {
sheet.getRange(index + 2, trangThaiCol)
.setValue(dataUpload.trangthai);
return { status: "updated" };
}

// DELETE
if (dataUpload.action === "delete") {
sheet.deleteRow(index + 2);
return { status: "deleted" };
}

return { error: "Action không hợp lệ" };
}

function jsonResponse(data) {
return ContentService
.createTextOutput(JSON.stringify(data))
.setMimeType(ContentService.MimeType.JSON);
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
