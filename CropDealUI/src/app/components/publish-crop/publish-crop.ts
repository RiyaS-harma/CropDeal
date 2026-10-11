import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandler } from '../../utils/error-handler';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-publish-crop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publish-crop.html',
  styleUrls: ['./publish-crop.css']
})
export class PublishCropComponent implements OnInit {
  crop = {
    cropName: '',
    cropType: '',
    quantity: 0,
    unit: 'kg',
    pricePerUnit: 0,
    location: '',
    description: '',
    imageUrl: ''
  };

  @Output() listingDone = new EventEmitter<void>();

  cropTypes = ['Vegetable', 'Fruit', 'Grain'];
  vegetables = ['Tomato', 'Potato', 'Onion', 'Carrot', 'Cabbage', 'Cauliflower'];
  fruits = ['Apple', 'Banana', 'Mango', 'Orange', 'Grapes', 'Watermelon'];
  grains = ['Wheat', 'Rice', 'Barley', 'Oats', 'Corn'];

  cropImages: any = {
    'Tomato': 'https://www.tastingtable.com/img/gallery/20-tricks-to-make-your-tomatoes-even-more-delicious/intro-1684770527.jpg',
    'Potato': 'https://www.bing.com/th/id/ODL.2183687e5e69cdb880ae5569d82b4776?w=310&h=198&c=7&rs=1&bgcl=ffff14&r=0&o=6&dpr=1.5&pid=AlgoBlockDebug',
    'Onion': 'https://tse2.mm.bing.net/th/id/OIP.DPg_wrFkrXg7_yXS-1toawHaFj?w=252&h=189&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
    'Carrot': 'https://tse3.mm.bing.net/th/id/OIP.uB7BZ-yZXynSbOAJyza9xAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3h',
    'Cabbage': 'https://tse3.mm.bing.net/th/id/OIP.ayw2TySkLO6SJbAA0V3IqwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3-05b4d80fbb9f',
    'Cauliflower': 'https://www.thespruce.com/thmb/wm8GqNcYLgtZPZ5tJOLN0-GSWu0=/2384x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-to-grow-cauliflower-1403494-05-f80a2beec2d145f0be8243311654e3c1.jpg',
    'Apple': 'https://parade.com/.image/t_share/MTkwNTgxNDY1MzcxMTkxMTY0/different-types-of-apples-jpg.jpg',
    'Banana': 'https://img.freepik.com/premium-photo/close-up-bananas_1048944-16391493.jpg86224',
    'Mango': 'https://cdn.pixabay.com/photo/2022/06/16/07/45/fruit-7265287_1280.jpg',
    'Orange': 'https://tse1.mm.bing.net/th/id/OIP.TTiKaA5YYPN-x7jzqI_f9QHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3',
    'Grapes': 'https://www.southernliving.com/thmb/BBIWYLbK4A5-sNcqzlTjt2kB16Y=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1061434056-7b173def9dae4e6cb31fc062dbb5f3b6.jpg',
    'Watermelon': 'https://minnetonkaorchards.com/wp-content/uploads/2022/10/Small-Harvested-Watermelons-SS-2171337033.jpg'
  };

  cropNames: string[] = [];
  customCropName = '';
  successMessage = '';
  errorMessage = '';
  isEditMode = false;
  cropId: number | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.cropId = +params['id'];
        this.loadCropData(this.cropId);
      }
    });
  }

  loadCropData(id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${environment.cropUrl}/api/crops/${id}`, { headers }).subscribe({
      next: (data: any) => {
        // Store the original crop name
        const originalCropName = data.cropName;

        // Set crop type first to populate the crop names list
        this.crop.cropType = data.cropType;
        this.onCropTypeChange();

        // Now check if the crop name is in the predefined list
        if (this.cropNames.includes(originalCropName)) {
          this.crop.cropName = originalCropName;
        } else {
          this.crop.cropName = '__other__';
          this.customCropName = originalCropName;
        }

        // Set the rest of the crop data
        this.crop.quantity = data.quantity;
        this.crop.unit = data.unit;
        this.crop.pricePerUnit = data.pricePerUnit;
        this.crop.location = data.location;
        this.crop.description = data.description;
        this.crop.imageUrl = data.imageUrl;
      },
      error: (error) => {
        this.errorMessage = ErrorHandler.extractErrorMessage(error);
      }
    });
  }

  onCropTypeChange(): void {
    switch(this.crop.cropType) {
      case 'Vegetable': this.cropNames = this.vegetables; break;
      case 'Fruit': this.cropNames = this.fruits; break;
      case 'Grain': this.cropNames = this.grains; break;
      default: this.cropNames = [];
    }
    this.crop.cropName = '';
    this.customCropName = '';
  }

  onCropNameChange(): void {
    if (this.crop.cropName !== '__other__') {
      this.customCropName = '';
      this.crop.imageUrl = this.cropImages[this.crop.cropName] || '';
    } else {
      this.crop.imageUrl = '';
    }
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const cropData = {
      ...this.crop,
      cropName: this.crop.cropName === '__other__' ? this.customCropName : this.crop.cropName
    };

    const request = this.isEditMode
      ? this.http.put(`${environment.cropUrl}/api/crops/${this.cropId}`, cropData, { headers })
      : this.http.post(`${environment.cropUrl}/api/crops`, cropData, { headers });

    const msg = this.isEditMode ? 'Crop updated successfully!' : 'Crop published successfully!';
    localStorage.setItem('cropSuccessMessage', msg);
    this.listingDone.emit();

    request.subscribe({
      next: () => {},
      error: (error) => {
        localStorage.removeItem('cropSuccessMessage');
        this.errorMessage = ErrorHandler.extractErrorMessage(error);
        console.error(error);
      }
    });
  }
}
