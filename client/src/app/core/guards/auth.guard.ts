import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDispatchService } from '../../features/users/services/user-dispatch.service';

export const authGuard: CanActivateFn = () => {
    const userDispatchService = inject(UserDispatchService);
    const router = inject(Router);

    if (userDispatchService.isUserLogged)
        return true;

    // Store attempted URL for redirecting after login (optional)
    // userService.redirectUrl = router.url;

    return router.createUrlTree(['/login']);
};