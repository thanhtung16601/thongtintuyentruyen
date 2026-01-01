/**
 * =========================================================
 * CẤU HÌNH API & DỮ LIỆU BÀI ĐĂNG
 * =========================================================
 */

/**
 * API Google Apps Script
 * - Dùng để:
 *   + Gửi dữ liệu đăng ký thăm thân (POST)
 *   + Lấy danh sách đăng ký / duyệt / xóa (GET)
 *
 * @constant {string}
 * @author NgocKhanh
 */
const API_URL =
  "https://script.google.com/macros/s/AKfycbwca_Ki68zUxN69fhg_MI-OeACcAhKcDrCfDfwlEJ41HvB8KGIq1e2_hZwZG2V3s6l1Iw/exec";
/**
 * Danh sách bài đăng / thông báo nội bộ
 * - Dùng để hiển thị bảng quản lý bài viết
 * - Có thể thay thế bằng dữ liệu từ API sau này
 *
 * @typedef {Object} Post
 * @property {number} id       - ID bài đăng
 * @property {string} image    - URL hình ảnh minh họa
 * @property {string} content  - Nội dung bài đăng
 * @property {string} date     - Ngày đăng (dd/mm/yyyy hh:mm)
 *
 * @type {Post[]}
 * @author NgocKhanh
 */
const DATA_POST = [
  {
    id: 1,
    image: "https://drive.google.com/uc?id=1IZLQx3QvR0vkAcCvpBsDdvN2FC4_WGhj",
    content: "Thông báo huấn luyện cấp đơn vị.",
    date: "11/02/2025 10:15",
    states: "warning",
  },
  {
    id: 2,
    image: "https://i.imgur.com/3JjVg9d.jpeg",
    content: "Cảnh quan doanh trại - cập nhật mới.",
    date: "12/02/2025 09:00",
    states: "normal",
  },
  {
    id: 3,
    image: "https://i.imgur.com/kQ7wH9R.jpeg",
    content: "Lễ chào cờ đầu tuần tại đơn vị.",
    date: "13/02/2025 06:30",
    states: "normal",
  },
  {
    id: 4,
    image: "https://i.imgur.com/9YjK6hT.jpeg",
    content: "Kiểm tra sẵn sàng chiến đấu định kỳ.",
    date: "13/02/2025 14:00",
    states: "danger",
  },
  {
    id: 5,
    image: "https://i.imgur.com/5ZQZ7sA.jpeg",
    content: "Hoạt động tăng gia sản xuất quý I.",
    date: "14/02/2025 08:00",
    states: "normal",
  },
  {
    id: 6,
    image: "https://i.imgur.com/3hXKZbF.jpeg",
    content: "Thông báo trực ban cuối tuần.",
    date: "14/02/2025 16:45",
    states: "warning",
  },
  {
    id: 7,
    image: "https://i.imgur.com/FYQ9F5R.jpeg",
    content: "Tổ chức sinh hoạt chính trị tháng 2.",
    date: "15/02/2025 19:00",
    states: "normal",
  },
  {
    id: 8,
    image: "https://i.imgur.com/qkG7v6F.jpeg",
    content: "Diễn tập phương án phòng chống cháy nổ.",
    date: "16/02/2025 09:30",
    states: "danger",
  },
  {
    id: 9,
    image: "https://i.imgur.com/MN0XJ7a.jpeg",
    content: "Thông báo nghỉ bù sau đợt huấn luyện cao điểm.",
    date: "17/02/2025 11:00",
    states: "warning",
  },
  {
    id: 10,
    image: "https://i.imgur.com/X4R7B8E.jpeg",
    content: "Hoạt động giao lưu văn hóa – thể thao.",
    date: "18/02/2025 15:20",
    states: "normal",
  },
  {
    id: 11,
    image: "https://i.imgur.com/0c7QZpF.jpeg",
    content: "Kiểm tra công tác doanh trại quý I.",
    date: "19/02/2025 08:30",
    states: "warning",
  },
  {
    id: 12,
    image: "https://i.imgur.com/8FZJw3H.jpeg",
    content: "Thông báo đảm bảo an toàn giao thông dịp lễ.",
    date: "20/02/2025 17:00",
    states: "danger",
  },
];
