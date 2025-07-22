import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDispatchService } from '../../features/users/services/user-dispatch.service';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async () => {
    const userDispatchService = inject(UserDispatchService);
    const router = inject(Router);

    await firstValueFrom(userDispatchService.waitForLoadingToEnd());
    if (userDispatchService.isAnAdmin) return true;

    return router.createUrlTree(['/']);
};