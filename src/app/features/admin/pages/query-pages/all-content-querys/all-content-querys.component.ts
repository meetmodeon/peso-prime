import { Component } from '@angular/core';
import { ContactQueryResponse } from '../../../../../services/model/contact-query.model';
import { QueryStatus } from '../../../../../services/model/FileType.model';
import { ContactQueryService } from '../../../../../services/contact-query/contact-query.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-content-querys',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink

  ],
  templateUrl: './all-content-querys.component.html',
  styleUrl: './all-content-querys.component.scss'
})
export class AllContentQuerysComponent {
  // ── Data ──────────────────────────────────────────────────────
  queries: ContactQueryResponse[] = [];
 
  // ── Pagination ────────────────────────────────────────────────
  currentPage   = 0;
  pageSize      = 10;
  totalPages    = 0;
  totalElements = 0;
 
  // ── Filters ───────────────────────────────────────────────────
  filter= { search: '', status: 'ALL' };
 
  readonly statusTabs: Array<{ label: string; value: QueryStatus|'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Read', value: QueryStatus.READ },
  { label: 'New', value: QueryStatus.NEW },
  { label: 'Replied', value: QueryStatus.REPLIED },
];
 
  // ── UI state ──────────────────────────────────────────────────
  loading  = false;
  deleting: number | null = null;
  error: string | null = null;
 
  // ── Search debounce ───────────────────────────────────────────
  private searchSubject = new Subject<string>();
  private destroy$      = new Subject<void>();
  QueryStatus: any;
 
  constructor(private svc: ContactQueryService) {}
 
  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(q => {
        this.filter.search = q;
        this.currentPage   = 0;
        this.load();
      });
 
    this.load();
  }
 
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  // ── Load ──────────────────────────────────────────────────────
  load(): void {
    this.loading = true;
    this.error   = null;
 
    this.svc.getAll(this.currentPage, this.pageSize, this.filter.search,this.filter.status).subscribe({
      next: page => {
        this.queries       = page.content;
        this.totalPages    = page.totalPages;
        this.totalElements = page.totalElements;
        this.loading       = false;
      },
      error: () => {
        this.error   = 'Failed to load contact queries. Please try again.';
        this.loading = false;
      },
    });
  }
 
  // ── Search ────────────────────────────────────────────────────
  onSearch(q: string): void { this.searchSubject.next(q); }
 
  clearSearch(): void {
    this.filter.search = '';
    this.currentPage   = 0;
    this.load();
  }
 
  // ── Status filter ─────────────────────────────────────────────
  setStatus(status: QueryStatus | 'ALL'): void {
    if (this.filter.status === status) return;
    this.filter.status = status;
    this.currentPage   = 0;
    this.load();
  }
 
  // ── Pagination ────────────────────────────────────────────────
  goToPage(p: number): void {
    if (p < 0 || p >= this.totalPages) return;
    this.currentPage = p;
    this.load();
  }
 
  get isFirstPage(): boolean { return this.currentPage === 0; }
  get isLastPage():  boolean { return this.currentPage >= this.totalPages - 1; }
  get startItem():   number  { return this.currentPage * this.pageSize + 1; }
  get endItem():     number  { return Math.min(this.startItem + this.pageSize - 1, this.totalElements); }
 
  get pageNumbers(): number[] {
    const result: number[] = [];
    let prev = -1;
    for (let i = 0; i < this.totalPages; i++) {
      if (i === 0 || i === this.totalPages - 1 ||
          (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        if (prev !== -1 && i - prev > 1) result.push(-1);
        result.push(i);
        prev = i;
      }
    }
    return result;
  }
 
  // ── Delete ────────────────────────────────────────────────────
  confirmDelete(q: ContactQueryResponse): void {
    if (!confirm(`Delete query from "${q.fullName}"? This cannot be undone.`)) return;
    this.deleting = q.id;
 
    this.svc.delete(q.id).subscribe({
      next: () => {
        this.deleting = null;
        if (this.queries.length === 1 && this.currentPage > 0) this.currentPage--;
        this.load();
      },
      error: () => {
        this.deleting = null;
        this.error = `Failed to delete query from "${q.fullName}".`;
      },
    });
  }
 
  // ── Helpers ───────────────────────────────────────────────────
statusClass(s: QueryStatus): string {
  const map: Record<QueryStatus, string> = {
    [QueryStatus.NEW]: 'bg-amber-50 text-amber-700 border-amber-200',
    [QueryStatus.READ]: 'bg-blue-50 text-blue-700 border-blue-200',
    [QueryStatus.REPLIED]: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return map[s];
}
 
statusDot(s: QueryStatus): string {
  const map: Record<QueryStatus, string> = {
    [QueryStatus.NEW]: 'bg-amber-500',
    [QueryStatus.READ]: 'bg-blue-500',
    [QueryStatus.REPLIED]: 'bg-emerald-500',
  };

  return map[s];
}
 
  initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
 
  avatarBg(id: number): string {
    const colours = [
      'bg-indigo-600', 'bg-violet-600', 'bg-blue-600',
      'bg-teal-600',   'bg-rose-600',   'bg-amber-600',
    ];
    return colours[id % colours.length];
  }
 
  truncate(text: string, max = 70): string {
    return text?.length > max ? text.slice(0, max) + '…' : text ?? '—';
  }
 
  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }
 
  trackById(_: number, item: ContactQueryResponse): number { return item.id; }


}
