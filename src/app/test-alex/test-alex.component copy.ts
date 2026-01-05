import { Component, inject, Input, OnInit } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Observable,map,of } from 'rxjs';
import { CommonModule } from '@angular/common';

interface FullDisplayState {
  selectedRecordId: string | null;
}
 
interface SearchState {
  entities: { [key: string]: any };
}

const selectFullDisplay = createFeatureSelector<FullDisplayState>('full-display');
const selectSearchState = createFeatureSelector<SearchState>('Search');
//Next, we create a selector to access the entities:
const selectSearchEntities = createSelector(
  selectSearchState,
  state => state.entities
);
const selectFullDisplayRecordId = createSelector(selectFullDisplay,  state => state.selectedRecordId);
//We can now combine both selectors to get the full record (including the pnx):
const selectFullDisplayRecord = createSelector(
  selectFullDisplayRecordId,
  selectSearchEntities,
  (recordId, searchEntities) => recordId ? searchEntities[recordId] : null 
);
export const selectListviewRecord = (recordId: string) =>
  createSelector(
    selectSearchEntities,
    entities => entities[recordId]
  );

@Component({
  selector: 'custom-test-alex',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-alex.component.html',
  styleUrl: './test-alex.component.scss'
})
export class TestAlexComponent {
  @Input() private hostComponent!: any; //needed for retrieving data from the record
	record$: Observable<any> | undefined;
  
	public store = inject(Store);	
  ngOnInit() {
    	this.record$ = this.store.select(selectFullDisplayRecord); 	//only works when actually viewing the full record
      const type = this.getType(this.record$);
      console.debug("test alex :",this.record$);
  }

  private getType(record: any): string | null {
    return record?.pnx?.display?.['type']?.[0] || "tuc";
}  

}
