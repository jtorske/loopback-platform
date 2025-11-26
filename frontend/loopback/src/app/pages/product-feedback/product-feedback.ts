import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-feedback.html',
  styleUrl: './product-feedback.css',
})
export class ProductFeedback {
  // For now hard-coded; later you can load this from a service or route params
  productName = 'Product Name';
  companyName = 'Company Name';

  feedbackText = '';
  tags = ['Praise', 'Enhancement', 'Bug Fix'];
  selectedTag: string | null = 'Praise';

  selectTag(tag: string) {
    this.selectedTag = tag;
  }

  onSubmit() {
    if (!this.feedbackText.trim()) {
      alert('Please enter some feedback before submitting.');
      return;
    }

    // Later: send to backend API here
    console.log('Submitted feedback:', {
      productName: this.productName,
      companyName: this.companyName,
      feedback: this.feedbackText,
      tag: this.selectedTag,
    });

    alert('Thank you for your feedback!');
    this.feedbackText = '';
    this.selectedTag = 'Praise';
  }

  onCancel() {
    // For now just clear. Later you can navigate away if you want.
    this.feedbackText = '';
    this.selectedTag = 'Praise';
  }
}
