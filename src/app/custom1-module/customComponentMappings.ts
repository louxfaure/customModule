import {UbmBriefDisplayComponent} from '../ubm-brief-display/ubm-brief-display.component'
import {UbmRecordActionsComponent} from '../ubm-record-actions/ubm-record-actions.component'

// Define the map
export const selectorComponentMap = new Map<string, any>([
    ['nde-record-main-details-before', UbmBriefDisplayComponent],
    // ['nde-main-actions-before', UbmRecordActionsComponent],
    //['nde-record-sub-action-before', UbmRecordActionsComponent],
    // ['nde-search-result-item-container-before', UbmBriefDisplayComponent]
]);
