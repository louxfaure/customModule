import {UbmBriefDisplayComponent} from '../ubm-brief-display/ubm-brief-display.component'
import {UbmRecordActionsComponent} from '../ubm-record-actions/ubm-record-actions.component'
import { UbmResourceTypeBarHookComponent } from '../ubm-resource-type-bar-hook/ubm-resource-type-bar-hook.component';
import { UbmCustomAvailabilityComponent } from '../ubm-custom-availability-component/ubm-custom-availability.component';
import {UbmHomepageActuComponent} from '../ubm-homepage-actu/ubm-homepage-actu.component'
import {UbmHelpOverlayComponent} from '../ubm-help-overlay/ubm-help-overlay.component'
import {UbmFooterComponent} from '../ubm-footer/ubm-footer.component'
import {UbmCustomResultListAfterComponent} from '../ubm-custom-result-list-after/ubm-custom-result-list-after.component'
import {UbmItemHookComponent} from '../ubm-item-hook/ubm-item-hook.component'

// Define the map
export const selectorComponentMap = new Map<string, any>([
    ['nde-record-main-details-before', UbmBriefDisplayComponent],
    ['nde-search-results-resource-type-bar-before', UbmResourceTypeBarHookComponent],
    ['nde-physical-availability-line-bottom', UbmCustomAvailabilityComponent],
    ['nde-landing-page',UbmHomepageActuComponent],
    ['nde-footer-bottom',UbmFooterComponent],
    ['nde-search-results-after',UbmCustomResultListAfterComponent],
    ['nde-location-item-top',UbmItemHookComponent]
    //['nde-footer-after',UbmHelpOverlayComponent]
    // ['nde-main-actions-before', UbmRecordActionsComponent]
]);
