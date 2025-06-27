import { Component, inject, OnInit } from '@angular/core';
import { Photo } from '../../_models/photo';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-photo-mangement',
  imports: [],
  templateUrl: './photo-mangement.component.html',
  styleUrl: './photo-mangement.component.css'
})
export class PhotoMangementComponent implements OnInit {
photos: Photo[] = [];
 private adminService = inject(AdminService);
 ngOnInit(): void {
 this.getPhotosForApproval();
 }
 getPhotosForApproval() {
 this.adminService.getPhotosForApproval().subscribe({
 next: photos => this.photos = photos
 })
 }
 approvePhoto(photoId: number) {
 this.adminService.approvePhoto(photoId).subscribe({
 next: () => this.photos.splice(this.photos.findIndex(p => p.id ===
photoId), 1)
 })
 }
 rejectPhoto(photoId: number) {
 this.adminService.rejectPhoto(photoId).subscribe({
 next: () => this.photos.splice(this.photos.findIndex(p => p.id ===
photoId), 1)
 })
 }
}
