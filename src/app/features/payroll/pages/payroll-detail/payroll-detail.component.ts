import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PayrollResponse } from '../../../payroll/model/payroll.model';
import { PayrollService } from '../../../payroll/services/payroll.service';

@Component({
  selector: 'app-payroll-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payroll-detail.component.html',
})
export class PayrollDetailComponent implements OnInit {
  payroll = signal<PayrollResponse | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private payrollService: PayrollService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPayroll(id);
  }

  loadPayroll(id: number): void {
    this.isLoading.set(true);
    this.payrollService.getById(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.payroll.set(res.data);
        } else {
          this.errorMessage.set(res.message);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load payroll details');
        this.isLoading.set(false);
      },
    });
  }

  markAsPaid(): void {
    const current = this.payroll();
    if (!current) return;
    if (!confirm('Mark this payroll as paid?')) return;

    this.payrollService.markAsPaid(current.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.payroll.set(res.data);
          this.successMessage.set('Payroll marked as paid successfully');
          setTimeout(() => this.successMessage.set(''), 3000);
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: () => {
        this.errorMessage.set('Failed to mark as paid');
      },
    });
  }

  getStatusBadge(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':      return 'badge badge-success';
      case 'pending':   return 'badge badge-warning';
      case 'cancelled': return 'badge badge-danger';
      default:          return 'badge badge-gray';
    }
  }
}
