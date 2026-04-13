import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ClientService } from '../../../../../services/client/client.service';
import { ClientStateService } from '../../../../../statemanagement/client/client-state.service';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Tab{
  label:string;
  value:string;
}

@Component({
  selector: 'app-all-client',
  imports: [
    CommonModule,
    RouterLink,
    
  ],
  templateUrl: './all-client.component.html',
  styleUrl: './all-client.component.scss'
})
export class AllClientComponent {

  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient,
    private clientService:ClientService,
    public clientState:ClientStateService
  ) {}
 
  // ── Tabs ──────────────────────────────────────────────────────
  tabs: Tab[] = [
    { label: 'All',      value: 'all'      }
  ];
  activeTab = 'all';
 
  // ── Pagination ────────────────────────────────────────────────
  currentPage = 0;
  pageSize    = 10;
  totalPages  = 0;
 
  get isFirstPage(): boolean { return this.currentPage === 0; }
  get isLastPage():  boolean { return this.currentPage >= this.totalPages - 1; }
 
  get startItem(): number {
    return this.clientState.totalElements() === 0
      ? 0
      : this.currentPage * this.pageSize + 1;
  }
 
  get endItem(): number {
    return Math.min(
      (this.currentPage + 1) * this.pageSize,
      this.clientState.totalElements()
    );
  }
 
  
 
  ngOnInit(): void {
    this.loadClients();
  }
 
  // ── Data Loading ──────────────────────────────────────────────
  loadClients(): void {
    this.loading = true;
    this.error   = null;
 
      this.clientService.getAll(undefined,this.currentPage,this.pageSize).subscribe({
        next: (res) => {
          console.log("All Client data are: ",res);
          this.clientState.setClients(res.content,res.totalElements);
          this.totalPages = res.totalPages;
          this.loading    = false;
        },
        error: (err) => {
          this.error   = err?.error?.message ?? 'Failed to load clients. Please try again.';
          this.loading = false;
        },
      });
  }
 
  // ── Tab Switching ─────────────────────────────────────────────
  setActiveTab(value: string): void {
    this.activeTab   = value;
    this.currentPage = 0;
    this.loadClients();
  }
 
  // ── Pagination ────────────────────────────────────────────────
  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadClients();
  }
 
  getVisiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const cur   = this.currentPage;
 
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i);
    }
 
    pages.push(0);
    if (cur > 3)          pages.push(-1);
    const start = Math.max(1, cur - 1);
    const end   = Math.min(total - 2, cur + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (cur < total - 4) pages.push(-1);
    pages.push(total - 1);
 
    return pages;
  }
 
  // ── Delete ────────────────────────────────────────────────────
  deleteClient(id: number, name: string): void {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    this.clientService.delete(id).subscribe({
      next:(res)=>{
        this.clientState.removeClient(id);
        toast.success("Client deleted successfully");
      },
      error:()=>{toast.error('Failed to delete client')}
    });
  }
 
  // ── Helpers ───────────────────────────────────────────────────
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
 
  getAvatarClass(id: number): string {
    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-violet-100 text-violet-700',
      'bg-sky-100 text-sky-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
    ];
    return colors[id % colors.length];
  }

}
