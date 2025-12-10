# My Pokédex – Frontend Developer Quiz

โปรเจ็กต์นี้เป็นแบบทดสอบตำแหน่ง Frontend Developer (Botnoi Group)  
โดยเป็นเว็บสำหรับค้นหาและเพิ่มการ์ดโปเกมอนลงใน Pokédex ส่วนตัว

---

## ผลลัพธ์ที่จะได้
<img width="1467" height="913" alt="1" src="https://github.com/user-attachments/assets/6261d7bd-44fb-4b70-9081-c72fc748c7f6" />
<img width="1462" height="919" alt="2" src="https://github.com/user-attachments/assets/36f87c9c-76ec-4928-92b6-062449896992" />
<img width="1464" height="934" alt="3" src="https://github.com/user-attachments/assets/2c961e6b-5013-411a-bce5-d12a7d40751c" />
<img width="1456" height="941" alt="4" src="https://github.com/user-attachments/assets/bc6c3d50-061b-4981-a0bd-0810a600a170" />
<img width="1460" height="933" alt="5" src="https://github.com/user-attachments/assets/8946320f-a970-4b07-963e-ac52c2bfb8b4" />



---

## Tech Stack

- Angular 15+
- TypeScript
- SCSS
- Node.js (Express) สำหรับ mock API
- JSON mock data

---

## วิธีติดตั้งและรันโปรเจ็กต์

-1) ติดตั้ง dependencies
bash
npm install

-2) รัน Backend (port 3030)
node src/server/server.js
API ที่ใช้: http://localhost:3030/api/cards

-3) รัน Frontend (Angular)
npm start เปิดเว็บที่: http://localhost:4200

---

ฟีเจอร์ของระบบ
- ค้นหา Pokémon ผ่าน Modal
- เพิ่มการ์ดลง Pokédex (ไม่ซ้ำกัน)
- แสดงค่าสถานะ HP / STR / WEAK พร้อมแถบ bar
- คำนวณ Happiness ตามสูตรของโจทย์
- UI จำลองหน้าตา iPad พร้อมแถบด้านล่าง

---

สูตรคำนวณตามโจทย์
•	HP = จำกัดค่า 0–100
•	STR = จำนวน attacks × 50 (max 100)
•	WEAK = จำนวน weaknesses × 100 (max 100)
•	Happiness = ((HP / 10) + (Damage / 10) + 10 - จำนวน weaknesses) / 5

---

สิ่งที่ได้เรียนรู้
- การจัดการ state และ data flow ใน Angular
- การใช้งาน HttpClient เรียก REST API
- การจัดแยก frontend และ backend mock
- การคำนวณค่าต่าง ๆ ตาม business logic
- การจัด UI ให้ตรงตามโจทย์และ responsive

---
ปัญหาที่พบระหว่างทำโปรเจกต์ และแนวทางแก้ไข

1) Backend mock API รันไม่ขึ้น เพราะหาไฟล์ JSON ไม่เจอ
ตัว server.js ต้องการอ่านไฟล์ mock/cards.json แต่ตำแหน่งไฟล์ไม่ตรงกับ path ที่เขียนไว้ ทำให้ Node มองไม่เห็นไฟล์และรันต่อไม่ได้ วิธีแก้คือปรับตำแหน่งไฟล์ให้ถูกต้อง หรือแก้ path ใน server.js ให้ตรงกับตำแหน่งจริง หลังแก้แล้ว API สามารถเรียกได้ปกติบนพอร์ต 3030

2) Angular รันไม่ได้เพราะเวอร์ชัน Node ไม่ตรง
เริ่มแรกเจอปัญหาใช้คำสั่ง ng serve ไม่ได้ เนื่องจากเวอร์ชัน Node.js ใหม่เกินไปจน Angular 15 ไม่รองรับ วิธีแก้คือลดเวอร์ชัน Node ลงมาเป็น 18.x จากนั้น Angular CLI ก็สามารถทำงานได้ปกติ

3) คำสั่ง ng ใช้งานไม่ได้
เกิดจากเครื่องยังไม่ได้ติดตั้ง Angular CLI แบบ global จึงต้องสั่งติดตั้งด้วย npm install -g @angular/cli
หลังติดตั้งแล้วคำสั่ง ng สามารถใช้ได้ตามปกติ

4) การค้นหา Pokémon ไม่ทำงาน เพราะข้อมูลบางใบมีรูปแบบไม่ตรงกัน
ข้อมูลการ์ดบางใบมี attack ที่เป็น “50+” หรือ “20×” ทำให้การคำนวณค่า stat และการค้นหาผิดพลาด วิธีแก้คือจัดการ clean ข้อมูลก่อน เช่นดึงเฉพาะตัวเลขออกมาใช้คำนวณ เพื่อให้ระบบแสดงผลได้สม่ำเสมอ

5) ปัญหาการกดปุ่มใน UI ไม่ตอบสนอง
บางปุ่มไม่ทำงานเพราะ event ถูก block โดยโครงสร้าง HTML และ directive ซ้อนกัน วิธีแก้คือปรับ DOM และตรวจสอบ method ให้ตรงกับที่เรียกใน template หลังแก้แล้วการกดปุ่มค้นหาและเลือกการ์ดทำงานได้ตามปกติ

โดยรวมแล้วปัญหาที่เจอส่วนใหญ่เกี่ยวกับ path ของไฟล์ โครงสร้างข้อมูล และเวอร์ชันเครื่อง ซึ่งเมื่อตรวจสอบลำดับการทำงานและแก้ให้ตรงจุดทั้งหมด ระบบก็สามารถทำงานได้สมบูรณ์ทั้งฝั่ง Backend และ Frontend

---

