// core/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDispatchService } from '../../features/users/services/user-dispatch.service';

export const adminGuard: CanActivateFn = () => {
    const userDispatchService = inject(UserDispatchService);
    const router = inject(Router);

    if (userDispatchService.isAnAdmin)
        return true;

    return router.createUrlTree(['/unuserorized']);
};