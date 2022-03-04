import { TestBed } from '@angular/core/testing';

import { CrudAdminService } from './crud-admin.service';

describe('CrudAdminService', () => {
  let service: CrudAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
