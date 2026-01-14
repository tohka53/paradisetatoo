import { Component, OnInit, OnDestroy } from '@angular/core';

interface CountdownTime {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
  
  countdown: CountdownTime = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  };
  
  private countdownInterval: any;
  // Fecha de lanzamiento: 45 días desde ahora (puedes ajustar)
  private launchDate: Date = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);

  ngOnInit(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.launchDate.getTime() - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.countdown = {
        days: this.padNumber(days),
        hours: this.padNumber(hours),
        minutes: this.padNumber(minutes),
        seconds: this.padNumber(seconds)
      };
    } else {
      this.countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };
    }
  }

  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
