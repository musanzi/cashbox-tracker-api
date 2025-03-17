import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Authorization } from '../shared/decorators/rights.decorators';
import { RoleEnum } from '../shared/enums/roles.enum';
import { DashboardData } from './utils/dashboard.interface';

@Controller('dashboard')
@Authorization(RoleEnum.Admin)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  getDashboardData(): Promise<DashboardData> {
    return this.dashboardService.getDashboardData();
  }
}
