import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  formGroup!: FormGroup;
  ageGroups = ['Infant', 'Child', 'Teenager', 'Young Adult', 'Adult', 'Senior'];
  ageRanges = ['0-2 years', '3-12 years', '13-19 years', '20-39 years', '40-59 years', '60+ years'];
  ageGroupRangeMapping: any = {
    'Infant': '0-2 years',
    'Child': '3-12 years',
    'Teenager': '13-19 years',
    'Young Adult': '20-39 years',
    'Adult': '40-59 years',
    'Senior': '60+ years'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      ageGroup: [''],
      ageRange: [{ value: '', disabled: true }],
      startDate: [''],
      endDate: [''],
      duration: ['']
    });

    this.formGroup.get('ageGroup')?.valueChanges.subscribe(value => {
      this.formGroup.get('ageRange')?.setValue(this.ageGroupRangeMapping[value]);
    });

    this.formGroup.get('startDate')?.valueChanges.subscribe(() => this.updateDuration());
    this.formGroup.get('endDate')?.valueChanges.subscribe(() => this.updateDuration());
    this.formGroup.get('duration')?.valueChanges.subscribe(() => this.updateEndDate());
  }

  onAgeGroupChange(ageGroup: string): void {
    this.formGroup.get('ageRange')?.setValue(this.ageGroupRangeMapping[ageGroup]);
  }

  onStartDateChange(): void {
    this.updateDuration();
  }

  onEndDateChange(): void {
    this.updateDuration();
  }

  onDurationChange(): void {
    this.updateEndDate();
  }

  updateDuration(): void {
    const startDate = this.formGroup.get('startDate')?.value;
    const endDate = this.formGroup.get('endDate')?.value;

    if (startDate && endDate) {
      const duration = moment(endDate).diff(moment(startDate), 'days');
      this.formGroup.get('duration')?.setValue(duration, { emitEvent: false });
    }
  }

  updateEndDate(): void {
    const startDate = this.formGroup.get('startDate')?.value;
    const duration = this.formGroup.get('duration')?.value;

    if (startDate && duration) {
      const endDate = moment(startDate).add(duration, 'days').toDate();
      this.formGroup.get('endDate')?.setValue(endDate, { emitEvent: false });
    }
  }
}
