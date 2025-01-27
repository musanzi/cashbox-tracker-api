import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RoleEnum } from '../shared/enums/roles.enum';
import { Ihierarchy } from './types/hierarchy.type';
import { IAuthorizedParams } from './types/authorized-params.type';

@Injectable()
export class RightsService {
  #hierarchies: Ihierarchy[] = [];

  constructor() {
    this.buildRoles([RoleEnum.Guest, RoleEnum.User, RoleEnum.Cashier, RoleEnum.Manager, RoleEnum.Admin]);
  }

  private buildRoles(roles: RoleEnum[]): void {
    this.#hierarchies = roles.map((role, i) => {
      const priority = ++i;
      return { role, priority };
    });
  }

  private getPriority(role: RoleEnum | null): number {
    return role ? this.#hierarchies.find((h) => h.role === role).priority : 1;
  }

  public isAuthorized({ currentRole, requiredRole }: IAuthorizedParams): void {
    const requiredPriority = this.getPriority(requiredRole);
    const currentPriority = this.getPriority(currentRole);
    if (!(currentPriority >= requiredPriority)) throw new UnauthorizedException();
  }
}
