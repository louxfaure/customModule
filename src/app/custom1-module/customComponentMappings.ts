import {UbmBriefDisplayComponent} from '../ubm-brief-display/ubm-brief-display.component'
import {UbmRecordActionsComponent} from '../ubm-record-actions/ubm-record-actions.component'
import {UbmResourceTypeBarHookComponent} from '../ubm-resource-type-bar-hook/ubm-resource-type-bar-hook.component';
import { UbmCustomAvailabilityComponent } from '../ubm-custom-availability-component/ubm-custom-availability.component';
import {UbmHomepageActuComponent} from '../ubm-homepage-actu/ubm-homepage-actu.component'
import {UbmFooterComponent} from '../ubm-footer/ubm-footer.component'
import {UbmCustomResultListAfterComponent} from '../ubm-custom-result-list-after/ubm-custom-result-list-after.component'
import {UbmItemHookComponent} from '../ubm-item-hook/ubm-item-hook.component'
import { UbmLoginFormHookComponent } from '../ubm-login-form-hook/ubm-login-form-hook.component';
import { UbmChangePasswordMessageComponent } from '../ubm-change-password-message/ubm-change-password-message.component';
import { RequestServicesComponent } from '../ubm-request-card-hook/ubm-request-card-hook.component';


// Define the map
export const selectorComponentMap = new Map<string, any>([
    ['nde-record-main-details-before', UbmBriefDisplayComponent],
    ['nde-search-results-resource-type-bar-before', UbmResourceTypeBarHookComponent],
    ['nde-physical-availability-line-bottom', UbmCustomAvailabilityComponent],
    ['nde-landing-page',UbmHomepageActuComponent],
    ['nde-footer-bottom',UbmFooterComponent],
    ['nde-search-results-after',UbmCustomResultListAfterComponent],
    ['nde-location-item-top',UbmItemHookComponent],
    ['nde-login-form-content-bottom',UbmLoginFormHookComponent],
    ['nde-personal-settings-bottom',UbmChangePasswordMessageComponent],
    //['nde-entity-related-docs-list-top',RequestServicesComponent],
    ['nde-actions-presenter-before', UbmRecordActionsComponent]
]);
