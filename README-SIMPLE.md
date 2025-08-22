# Word-to-Text Converter (No Database Version)

A simple React and Express.js web application for Word document processing and Vietnamese question extraction.

## Features

- Upload and convert .docx files to text
- Extract structured questions in JSON format
- Support for Vietnamese quiz format parsing
- Download extracted text and JSON
- **No database required - uses in-memory storage**

## Quick Start

### Windows
1. Install Node.js 18+ từ [nodejs.org](https://nodejs.org/)
2. Tải dự án về và giải nén
3. Chạy `setup.bat` 
4. Chạy `start.bat`

### Linux/macOS
1. Install Node.js 18+
2. Tải dự án về và giải nén
3. Chạy `chmod +x setup.sh start.sh`
4. Chạy `./setup.sh`
5. Chạy `./start.sh`

### Manual Setup (All Platforms)
```bash
# Install dependencies
npm install

# Start application
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5000

## No Database Required!

Ứng dụng này sử dụng in-memory storage, nghĩa là:
- ✅ Không cần cài đặt PostgreSQL
- ✅ Không cần cấu hình database  
- ✅ Chạy ngay sau khi install
- ⚠️ Data sẽ mất khi restart server
- ⚠️ Chỉ phù hợp cho development/testing

## Vietnamese Question Format

Ứng dụng nhận diện format câu hỏi tiếng Việt:
```
Đoạn văn câu hỏi: [Question text]
Select one:
a. [Answer A]
b. [Answer B] 
c. [Answer C]
d. [Answer D]
Phản hồi
Đáp án đúng là: [Correct answer]
Vì: [Explanation]
Tham khảo: [Reference]
```

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared types
├── setup.bat        # Windows setup
├── setup.sh         # Linux/macOS setup
├── start.bat        # Windows start
├── start.sh         # Linux/macOS start
└── README-SIMPLE.md # This file
```

## Troubleshooting

**Windows:**
- Lỗi "Node.js not found": Cài Node.js từ nodejs.org
- Lỗi permission: Chạy Command Prompt as Administrator

**Linux/macOS:**
- Lỗi permission: Dùng `chmod +x setup.sh start.sh`
- Node.js cũ: Dùng nvm để cài Node.js 18+

**Chung:**
- Port 5000 bị chiếm: Đổi PORT trong file .env
- Dependencies lỗi: Xóa node_modules và chạy `npm install` lại