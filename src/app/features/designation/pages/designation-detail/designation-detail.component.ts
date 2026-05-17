import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DesignationService } from '../../services/designation.service';
import { Designation } from '../../models/designation.model';

@Component({
  selector: 'app-designation-detail',
  imports: [RouterLink],
  templateUrl: './designation-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignationDetailComponent {
  private readonly designationService = inject(DesignationService);

  readonly id = input.required<string>();

  protected readonly designation = signal<Designation | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadDesignation();
  }

  private loadDesignation(): void {
    this.isLoading.set(true);

    this.designationService
      .getDesignationById(Number(this.id()))
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const items = response.data?.items ?? [];
          const designation = Array.isArray(items) ? items[0] : items;
          this.designation.set(designation ?? null);
        },
        error: () => {
          this.errorMessage.set('Failed to load designation details.');
        },
      });
  }
}
