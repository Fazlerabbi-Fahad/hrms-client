import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll.service';
import { Employee } from '../../../employees/models/employee.model';
import { EmployeeService } from '../../../employees/services/employee.service';

@Component({
  selector: 'app-payroll-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payroll-form.component.html',
})
export class PayrollFormComponent implements OnInit {
  payrollForm!: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  private readonly employeeService = inject(EmployeeService);
  protected readonly employeeOptions = signal<Employee[]>([]);

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

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private router: Router,
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.loadEmployees()
    this.payrollForm = this.fb.group({
      employeeId: [null, [Validators.required, Validators.min(1)]],
      month: [new Date().getMonth() + 1, Validators.required],
      year: [new Date().getFullYear(), Validators.required],
    });
  }

  private loadEmployees(): void {

    let params = {
      pageNumber: 1,
      pageSize: 100,
    };
    this.employeeService.getEmployees(params).subscribe({
      next: (response) => {
        this.employeeOptions.set(response.data?.items ?? []);
      },
      error: () => {
        this.errorMessage.set('Failed to load employees.');
      },
    });
  }

  onSubmit(): void {
    if (this.payrollForm.invalid) {
      this.payrollForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.payrollService.processPayroll(this.payrollForm.value).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.successMessage.set('Payroll processed successfully!');
          setTimeout(() => this.router.navigate(['/payroll']), 1500);
        } else {
          this.errorMessage.set(res.message);
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Failed to process payroll',
        );
        this.isSubmitting.set(false);
      },
    });
  }

  // Helper for showing validation errors
  isInvalid(field: string): boolean {
    const control = this.payrollForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
