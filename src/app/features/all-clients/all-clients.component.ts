import { Component } from '@angular/core';
import { ClientResponse } from '../../services/model/Client.model';
import { ClientService } from '../../services/client/client.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecureImageDirective } from "../../directives/secure-image/secure-image.directive";

@Component({
  selector: 'app-all-clients',
  imports: [
    CommonModule,
    FormsModule,
    SecureImageDirective
],
  templateUrl: './all-clients.component.html',
  styleUrl: './all-clients.component.scss'
})
export class AllClientsComponent {
  allClients: ClientResponse[] = [];
  currentPage = 0;
  pageSize = 10;
  isLast = false;
  totalElements!: number;
  searchQuery = '';
  isLoading = false;
  isLoadingMore = false;
 
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
 
  constructor(private clientService: ClientService) {}
 
  ngOnInit(): void {
    this.loadClients();
 
    // Debounced search: waits 400ms after user stops typing
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        this.resetAndSearch(query);
      });
  }
 
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }
 
  clearSearch(): void {
    this.searchQuery = '';
    this.resetAndSearch('');
  }
 
  private resetAndSearch(query: string): void {
    this.currentPage = 0;
    this.allClients = [];
    this.isLast = false;
    this.loadClients(query);
  }
 
  loadClients(search: string = this.searchQuery): void {
    if (this.currentPage === 0) {
      this.isLoading = true;
    } else {
      this.isLoadingMore = true;
    }
 
    this.clientService
      .getAll(search,this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const incoming = res.content ?? [];
          if (this.currentPage === 0) {
            this.allClients = incoming;
          } else {
            this.allClients = [...this.allClients, ...incoming];
          }
          this.totalElements = res.totalElements;
          this.isLast = res.last;
          this.isLoading = false;
          this.isLoadingMore = false;
        },
        error: () => {
          this.isLoading = false;
          this.isLoadingMore = false;
        }
      });
  }
 
  loadMore(): void {
    if (!this.isLast && !this.isLoadingMore) {
      this.currentPage++;
      this.loadClients();
    }
  }
 
  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

}
