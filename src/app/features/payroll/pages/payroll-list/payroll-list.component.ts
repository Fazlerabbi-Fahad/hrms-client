import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../services/payroll.service';
import { PayrollQueryParams, PayrollResponse } from '../../model/payroll.model';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, RouterModule,PaginatorComponent,FormsModule],
  templateUrl: './payroll-list.component.html',
})
export class PayrollListComponent implements OnInit {
  payrolls = signal<PayrollResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  currentPage = signal(1);
  totalPages = signal(0);
  totalCount = signal(0);
  searchQuery = signal('');

  filteredPayrolls = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.payrolls();
    return this.payrolls().filter(
      (p) =>
        p.employeeName.toLowerCase().includes(query) ||
        p.empCode.toLowerCase().includes(query) ||
        p.department.toLowerCase().includes(query) ||
        p.paymentStatus.toLowerCase().includes(query)
    );
  });

  params: PayrollQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    month: undefined,
    year: new Date().getFullYear(),
    paymentStatusId: undefined,
  };

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  years: number[] = [];

  constructor(private payrollService: PayrollService) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.loadPayrolls();
  }

  loadPayrolls(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.payrollService.getAll(this.params).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.payrolls.set(res.data.items);
          this.totalCount.set(res.data.totalCount);
          this.totalPages.set(res.data.totalPages);
          this.currentPage.set(res.data.pageNumber);
        } else {
          this.errorMessage.set(res.message);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load payrolls');
        this.isLoading.set(false);
      },
    });
  }

  onFilter(): void {
    this.params.pageNumber = 1;
    this.currentPage.set(1);
    this.loadPayrolls();
  }

  goToPage(page: number): void {
    this.params.pageNumber = page;
    this.currentPage.set(page);
    this.loadPayrolls();
  }

  markAsPaid(id: number): void {
    if (!confirm('Mark this payroll as paid?')) return;

    this.payrollService.markAsPaid(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.successMessage.set('Payroll marked as paid successfully');
          this.loadPayrolls();
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
    switch (status.toLowerCase()) {
      case 'paid':      return 'badge badge-success';
      case 'pending':   return 'badge badge-warning';
      case 'cancelled': return 'badge badge-danger';
      default:          return 'badge badge-gray';
    }
  }
}
