import { RoleEnum } from '../../shared/enums/roles.enum';

export interface IAuthorizedParams {
  currentRole: RoleEnum;
  requiredRole: RoleEnum;
}
