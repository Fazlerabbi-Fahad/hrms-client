import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DesignationService } from '../../services/designation.service';
import { Designation } from '../../models/designation.model';

@Component({
  selector: 'app-designation-list',
  imports: [RouterLink],
  templateUrl: './designation-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignationListComponent {
  private readonly designationService = inject(DesignationService);

  protected readonly designations = signal<Designation[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly searchQuery = signal('');

  constructor() {
    this.loadDesignations();
  }

  private loadDesignations(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.designationService
      .getDesignations()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.designations.set(response.data?.items ?? []);
        },
        error: () => {
          this.errorMessage.set('Failed to load designations. Please try again.');
        },
      });
  }

  protected deleteDesignation(id: number): void {
    if (!confirm('Are you sure you want to delete this designation?')) return;

    this.designationService.deleteDesignation({ id }).subscribe({
      next: () => {
        this.designations.update((list) => list.filter((d) => d.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete designation.');
      },
    });
  }

  protected readonly filteredDesignations = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.designations();
    return this.designations().filter((d) =>
      d.designationName.toLowerCase().includes(query)
    );
  });
}
