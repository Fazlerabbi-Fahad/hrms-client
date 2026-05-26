import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DesignationService } from '../../services/designation.service';
import { Designation } from '../../models/designation.model';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-designation-list',
  imports: [RouterLink,PaginatorComponent],
  templateUrl: './designation-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignationListComponent {
  private readonly designationService = inject(DesignationService);

  protected readonly designations = signal<Designation[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly searchQuery = signal('');


  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(0);
  protected readonly totalCount = signal(0);

  constructor() {
    this.loadDesignations();
  }

  private loadDesignations(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);


    let params = {
      pageNumber: this.currentPage(),
      pageSize: 10,
    };

    this.designationService
      .getDesignations(params)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.designations.set(response.data?.items ?? []);
          this.totalPages.set(response.data?.totalPages ?? 0);
          this.totalCount.set(response.data?.totalCount ?? 0);
          this.currentPage.set(response.data?.pageNumber ?? 1);
        },
        error: () => {
          this.errorMessage.set('Failed to load designations. Please try again.');
        },
      });
  }

  protected deleteDesignation(id: number): void {
    if (!confirm('Are you sure you want to delete this designation?')) return;

    this.designationService.deleteDesignation(id).subscribe({
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


  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadDesignations();
  }
}
