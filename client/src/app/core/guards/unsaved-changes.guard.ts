import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
    canDeactivate: () => boolean | Promise<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> =
    (component) => {
        // If the component has a canDeactivate method, use it
        if (component.canDeactivate) {
            return component.canDeactivate();
        }

        // Otherwise, allow navigation
        return true;
    };