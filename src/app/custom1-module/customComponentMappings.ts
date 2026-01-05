import { TestAlexComponent } from '../test-alex/test-alex.component';
import {UbmBriefDisplayComponent} from '../ubm-brief-display/ubm-brief-display.component'

// Define the map
export const selectorComponentMap = new Map<string, any>([
    ['nde-record-main-details-before', TestAlexComponent],
    ['nde-search-result-item-container-before', UbmBriefDisplayComponent]
]);
