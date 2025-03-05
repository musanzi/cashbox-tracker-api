import { RoleEnum } from '../../shared/enums/roles.enum';

export interface QueryParams {
  page: number | null;
  role: RoleEnum;
}
