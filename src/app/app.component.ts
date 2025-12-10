import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Attack {
  name: string;
  damage: string;
}

interface Weakness {
  type: string;
  value: string;
}

interface Pokemon {
  id: string;
  name: string;
  imageUrl: string;
  hp: string;
  attacks?: Attack[];
  weaknesses?: Weakness[];
  types?: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // ข้อมูลหลัก
  pokedex: Pokemon[] = [];       // โปเกม่อนที่เราเลือกแล้ว
  searchResults: Pokemon[] = []; // ผลการค้นหา

  // ตัวแปรค้นหา
  searchName: string = '';
  searchType: string = '';       // ตอนนี้ popup มีแค่ช่องชื่อ แต่เผื่อไว้ใช้ทีหลังได้
  isModalOpen: boolean = false;
  searchLoading: boolean = false;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // เริ่มต้นยังไม่ต้องโหลดอะไร
  }

  /* ==========================
     Modal + ค้นหา
     ========================== */

  openModal() {
    this.isModalOpen = true;
    this.searchResults = [];
    this.searchName = '';
    this.searchType = '';
    this.searchCards(); // โหลดการ์ดชุดแรกมาแสดงเลย
  }

  closeModal() {
    this.isModalOpen = false;
  }

  searchCards() {
    this.searchLoading = true;
    this.error = '';

    let apiUrl = `http://localhost:3030/api/cards?limit=20`;
    if (this.searchName) apiUrl += `&name=${this.searchName}`;
    if (this.searchType) apiUrl += `&type=${this.searchType}`;

    this.http.get<{ cards: Pokemon[] }>(apiUrl).subscribe({
      next: (response) => {
        // กรองเอาตัวที่อยู่ใน pokedex แล้วออก
        this.searchResults = response.cards.filter(
          (card) => !this.pokedex.find((p) => p.id === card.id)
        );
        this.searchLoading = false;
      },
      error: () => {
        this.error = 'ค้นหาไม่เจอ หรือเซิร์ฟเวอร์มีปัญหา';
        this.searchLoading = false;
      },
    });
  }

  /* ==========================
     เพิ่ม / ลบ การ์ด
     ========================== */

  addToPokedex(card: Pokemon) {
    this.pokedex.push(card);
    // ลบออกจากผลค้นหา ไม่ให้กด Add ซ้ำ
    this.searchResults = this.searchResults.filter((c) => c.id !== card.id);
  }

  removeFromPokedex(card: Pokemon) {
    this.pokedex = this.pokedex.filter((c) => c.id !== card.id);
  }

  /* ==========================
     Helper สำหรับ damage / stat
     ========================== */

  // รวม damage ของทุก attack (ดึงเฉพาะตัวเลข เช่น "50+" -> 50)
  private getTotalDamage(card: Pokemon): number {
    let totalDamage = 0;

    if (card.attacks) {
      card.attacks.forEach((atk) => {
        if (!atk.damage) return;
        const num = parseInt(atk.damage.replace(/[^0-9]/g, '') || '0', 10);
        if (!isNaN(num)) {
          totalDamage += num;
        }
      });
    }

    return totalDamage;
  }

  /* ==========================
     ส่วนคำนวณค่าพลัง (ตามโจทย์)
     ========================== */

  // HP: เกิน 100 ปัดเป็น 100
  getHpLevel(card: Pokemon): number {
    let hp = parseInt(card.hp || '0', 10);
    if (isNaN(hp)) hp = 0;
    return hp > 100 ? 100 : hp;
  }

  // STR: attacks.length * 50, max 100
  getStrengthLevel(card: Pokemon): number {
    const len = card.attacks ? card.attacks.length : 0;
    const str = len * 50;
    return str > 100 ? 100 : str;
  }

  // WEAK: weaknesses.length * 100, max 100
  getWeaknessLevel(card: Pokemon): number {
    const len = card.weaknesses ? card.weaknesses.length : 0;
    const weak = len * 100;
    return weak > 100 ? 100 : weak;
  }

  // Happiness: ((HP / 10) + (Damage / 10) + 10 - (WeaknessCount)) / 5
  getHappiness(card: Pokemon): number {
    const hp = this.getHpLevel(card);
    const totalDamage = this.getTotalDamage(card);
    const weaknessCount = card.weaknesses ? card.weaknesses.length : 0;

    const happiness = (hp / 10 + totalDamage / 10 + 10 - weaknessCount) / 5;
    return Math.floor(happiness) || 0;
  }

  /* ==========================
     ฟังก์ชันสำหรับ popup bars
     ========================== */

  // ใช้ค่าเดียวกับ level แต่คืนเป็น % สำหรับ width ของแถบ
  getHpBar(card: Pokemon): number {
    return this.getHpLevel(card); // 0–100
  }

  getStrengthBar(card: Pokemon): number {
    return this.getStrengthLevel(card); // 0–100
  }

  getWeaknessBar(card: Pokemon): number {
    return this.getWeaknessLevel(card); // 0–100
  }

  // สำหรับวนแสดงอีโมจิความสุขใน popup (0–5 ดวง)
  getHappinessArray(card: Pokemon): any[] {
    let happy = this.getHappiness(card);
    if (happy < 0) happy = 0;
    if (happy > 5) happy = 5;
    return Array(happy).fill(0);
  }

  /* ==========================
     สีพื้นหลังการ์ดใน pokedex
     ========================== */

  getCardColor(_: Pokemon): string {
    return '#f3f4f7';
  }
}
