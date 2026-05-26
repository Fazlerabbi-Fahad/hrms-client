import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll.service';
import { PayrollReport } from '../../model/payroll.model';
@Component({
  selector: 'app-payroll-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payroll-report.component.html'
})
export class PayrollReportComponent implements OnInit {
  report = signal<PayrollReport | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  month = signal(new Date().getMonth() + 1);
  year = signal(new Date().getFullYear());

  // Computed percentage - auto updates when report changes
  paidPercentage = computed(() => {
    const r = this.report();
    if (!r || r.totalEmployees === 0) return 0;
    return Math.round((r.paidCount / r.totalEmployees) * 100);
  });

  pendingPercentage = computed(() => 100 - this.paidPercentage());

  months = [
    { value: 1,  label: 'January'   },
    { value: 2,  label: 'February'  },
    { value: 3,  label: 'March'     },
    { value: 4,  label: 'April'     },
    { value: 5,  label: 'May'       },
    { value: 6,  label: 'June'      },
    { value: 7,  label: 'July'      },
    { value: 8,  label: 'August'    },
    { value: 9,  label: 'September' },
    { value: 10, label: 'October'   },
    { value: 11, label: 'November'  },
    { value: 12, label: 'December'  },
  ];

  years: number[] = [];

  constructor(private payrollService: PayrollService) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.report.set(null);

    this.payrollService
      .getMonthlyReport(this.month(), this.year())
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.report.set(res.data);
          } else {
            this.errorMessage.set(res.message);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to load report');
          this.isLoading.set(false);
        },
      });
  }
}
