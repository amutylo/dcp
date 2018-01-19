<template>
    <div class="container">
        <form>
            <div class="row">
                <div class="form-block center-block">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="suburb">Suburb</label>
                                <v-select placeholder="Select a suburb" id="suburb" class="form-control" v-model="selectedSuburb" :options="suburbs"></v-select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="development-type">Development Type</label>
                                <v-select
                                        placeholder="Select development type"
                                        id="development-type"
                                        class="form-control"
                                        v-model="selectedDevelopmentType"
                                        :options="developmentTypes"
                                        :value.sync="value"
                                ></v-select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" v-show="this.checkVisDwellings()">
                        <label for="exist-dwelling">Tell us the number of existing dwellings (if no dwellings on the land type 0)</label>
                        <input
                          type="number"
                          id="exist-dwelling"
                          class="form-control" 
                          v-model="dwellings"
                          @change="updateDwelling($event.target.value)"
                          @focus="updateResultDwellings()"
                          />
                    </div>
                    <div class="form-group" v-show="this.checkVisDwellings()">
                        <label for="total-dwelling">Tell us the total number of existing dwellings, including existing dwelings to be retained/replaced </label>
                        <input
                          type="number"
                          id="total-dwelling"
                          class="form-control" 
                          v-model="totalDwellings"
                          @change="updateTotalDwelling($event.target.value)"
                          @blur="updateTotalDwelling($event.target.value)"
                          @focus="updateTotalDwelling($event.target.value)"
                          />
                    </div>
                </div>
            </div>
            <div class="row" v-show="this.checkVisIsVacant()">
                <div class="form-block center-block radio-wrapper">
                    <div class="form-group" v-show="this.checkVisIsVacant()">
                        <p>Are you developing vacant land?</p>
                        <radio id="vacant-yes" name="vacant" value="1" v-model="vacant" @input="updateVacant($event)" >
                            Yes
                        </radio>
                        <radio id="vacant-no" name="vacant" value="0" v-model="vacant" @input="updateVacant($event)">
                            No
                        </radio>
                    </div>
                    <div class="form-group" v-show="this.checkVisVacantLand()">
                        <label for="vacant-yes-sqm">Tell us the total gross floor area (sqm) :</label>
                        <input
                            type="number"
                            placeholder="00.00"
                            id="vacant-yes-sqm"
                            class="form-control"
                            v-model="vacantLandFloor"
                            @change="updateVacantLandFloor()" >
                    </div>
                    <div class="form-group" v-show="this.checkVisDamaged()">
                        <p>Are you rebuilding as a result of unintentional damage?</p>
                        <radio id="damaged-yes" name="damaged" value="1" v-model="damaged" @input="updateUnintentionalDamage($event)">
                            Yes
                        </radio>
                        <radio id="damaged-no" name="damaged" value="0" v-model="damaged" @input="updateUnintentionalDamage($event)">
                            No
                        </radio>
                    </div>
                    <div class="form-group" v-show="this.checkVisIsIncrease()">
                        <p>Is there an increase in gross floor area (sqm)?</p>
                        <radio id="increase-floor-yes" name="increased" value="1" v-model="isIncrease" @input="updateYesIncrease()">
                            Yes
                        </radio>
                        <radio id="increase-floor-no" name="increased" value="0" v-model="isIncrease" @input="updateNoIncrease()">
                            No
                        </radio>
                    </div>
                    <div class="form-group" v-show="this.checkVisDamagedIncreased()">
                        <label for="damaged-increased">What is the increase of gross floor area (sqm) :</label>
                        <input
                            type="number"
                            placeholder="00.00"
                            id="damaged-increased"
                            class="form-control"
                            v-model="damagedIncreasedFloor"
                            @change="updateDamagedIncreasedFloor()" >
                    </div>
                    <div class="form-group" v-show="this.checkVisBuildingType()">
                        <p>Are you:</p>
                        <div>
                            <radio id="existing-building" name="buildingtype" value="exist" v-model="buildingType" @input="updateBoth()">
                                Extending the existing building?
                            </radio>
                        </div>
                        <div>
                            <radio id="new-building" name="buildingtype" value="new" v-model="buildingType" @input="updateNew()">
                                Constructing a new building?
                            </radio>
                        </div>
                        <div>
                            <radio id="both-buildings" name="buildingtype" value="both" v-model="buildingType" @input="updateBoth()">
                                Extending the existing building and constructing a new building/s?
                            </radio>
                        </div>
                    </div>
                    <div class="form-group" v-show="this.checkVisBuildingFloor()">
                        <label for="building-floor-increased">What is the increase of gross floor area (sqm) :</label>
                        <input
                            type="number"
                            placeholder="00.00"
                            id="building-floor-increased"
                            class="form-control"
                            v-model="buildingFloorIncreased"
                            @change="updateBuildingFloorIncreased()" >
                    </div>
                    <div class="form-group" v-show="this.checkVisBuildingFloor('new')">
                        <label for="building-floor-new">Tell us the total gross floor area (sqm) :</label>
                        <input
                            type="number"
                            placeholder="00.00"
                            id="building-floor-new"
                            class="form-control"
                            v-model="buildingFloorNew"
                            @change="updateBuildingFloorNew()" >
                    </div>
                </div>
            </div>
            <div class="row" v-show="this.showCalculate">
                <div class="form-block text-center center-block">
                    <button type="button"
                            class="btn-base"
                            @click="calculate">Calculate
                    </button>
                    <button type="button"
                            class="btn-base"
                            @click="resetValues">Reset
                    </button>
                </div>
            </div>
        </form>
        <div class="row">
            <div class="form-block center-block selected-data">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h2>Your selected data:</h2>
                    </div>
                    <div class="panel-body">
                        <p v-if="this.checkVisSuburb()"><strong>Suburb:</strong> {{suburbLabel}}</p>
                        <p v-if="this.checkVisDevType()"><strong>Development type:</strong> {{typeLabel}}</p>
                        <p v-if="this.checkVisDwellings()"><strong>Number of dwellings:</strong> {{dwellings}}</p>
                        <p v-if="this.checkVisTotalDwelling()"><strong>Total number of dwellings:</strong> {{totalDwellings}}</p>
                        <p v-if="this.checkVisIsVacant()"><strong>Are you developing a vacant land?</strong> {{vacant | tostring}}</p>
                        <p v-if="this.checkVisVacantLand()"><strong>Vacant land floor (sqm):</strong> {{vacantLandFloor}}</p>
                        <p v-if="this.checkVisDamaged()"><strong>Are you rebuilding as a result of unintentional damage?</strong> {{damaged | tostring}}</p>
                        <p v-if="this.checkVisIsIncrease()"><strong>Is there an increase in floor area?</strong> {{isIncrease | tostring}}</p>
                        <p v-if="this.checkVisDamagedIncreased()"><strong>Increased total gross floor area (sqm):</strong> {{damagedIncreasedFloor}}</p>
                        <p v-if="this.checkVisBuildingType()" v-html="buildingTypeLabel">{{buildingTypeLabel}}</p>
                        <p v-if="this.checkVisBuildingFloor()"><strong>Increased floor area (sqm): </strong> {{buildingFloorIncreased}}</p>
                        <p v-if="this.checkVisBuildingFloor('new')"><strong>New floor area (sqm):</strong> {{buildingFloorNew}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="showResultBlock">
            <div class="form-block center-block yellow-box">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h2>Calculation</h2>
                    </div>
                    <div class="panel-body" v-if="showResult">
                        <div class="result">
                            <strong>DIL:</strong>$<span>{{ calculatedDil | currency }}</span>
                        </div>
                        <div class="result">
                            <strong>CIL:</strong>$<span>{{ calculatedCil | currency }}</span>
                        </div>
                        <div class="result">
                            <strong>Total:</strong>$<span>{{ calculatedTotal | currency }}</span>
                        </div>
                    </div>
                    <div class="panel-body" v-else>
                        <div class="result">
                            <p><strong>There is no fee ($0) for the selected options</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import suburbs from './suburbs.json';
    console.log('suburbs ', suburbs)
    export default {
      data() {
        return{
          selectedSuburb: null,
          suburbs:[
            {value:'albv', label:'Albanvale'},
            {value:'albn', label:'Albion'},
            {value:'ardr', label:'Ardeer'},
            {value:'crnl', label:'Cairnlea'},
            {value:'cdpk', label:'Calder Park'},
            {value:'drpk', label:'Deer Park'},
            {value:'dlhy', label:'Delahey'},
            {value:'drmt', label:'Derrimut'},
            {value:'hlsd', label:'Hillside'},
            {value:'klba', label:'Kealba'},
            {value:'kelr', label:'Keilor'},
            {value:'kldw', label:'Keilor Downs'},
            {value:'kles', label:'Keilor East'},
            {value:'kllg', label:'Keilor Lodge'},
            {value:'klnt', label:'Keilor North'},
            {value:'klpr', label:'Keilor Park'},
            {value:'knpr', label:'Kings Park'},
            {value:'sawa', label:'St Albans (west of St Albans Rd)'},
            {value:'saea', label:'St Albans (east of St Albans Rd)'},
            {value:'ssab', label:'Sunshine'},
            {value:'ssnt', label:'Sunshine North'},
            {value:'sstc', label:'Sunshine Town Centre'},
            {value:'sswt', label:'Sunshine West'},
            {value:'sdhm', label:'Sydenham' },
            {value:'tles', label:'Taylors Lakes (east of Sunshine Ave)'},
            {value:'tlws', label:'Taylors Lakes (west of Sunshine Ave)'},
            {value:'tlmn', label:'Tullamarine'}
          ],
          areas:[
            {hlsd:'01'},
            {sdhm:'01'},
            {cdpk:'02'},
            {kllg:'02'},
            {klnt:'02'},
            {tlws:'02'},
            {kelr:'03'},
            {tles:'03'},
            {dlhy:'04'},
            {kldw:'05'},
            {kles:'06'},
            {klpr:'06'},
            {tlmn:'06'},
            {knpr:'07'},
            {sawa:'08'},
            {saea:'09'},
            {klba:'10'},
            {albv:'11'},
            {crnl:'12'},
            {drpk:'13'},
            {ardr:'14'},
            {albn:'15'},
            {ssnt:'16'},
            {drmt:'17'},
            {sswt:'18'},
            {ssab:'19'},
            {sstc:'20'}
          ],
          selectedDevelopmentType: null,
          developmentTypes:[
            {value:'rsdn', label:'Residential'},
            {value:'retl', label:'Retail'},
            {value:'comm', label:'Commercial'},
            {value:'inds', label:'Industrial'}
          ],
          dwellings: 0,
          totalDwellings: 0,
          rates:{
            'hlsd':
              {
                'rsdn':{'dilpd': 184.63, 'cilpd': 722.71, 'tipd': 907.34},
                'retl':{'devsqm': 5.43, 'comsqm': 0.00, 'totsqm': 5.43},
                'comm':{'devsqm': 2.00, 'comsqm': 0.00, 'totsqm': 2.00},
                'inds':{'devsqm': 0.48, 'comsqm': 0.00, 'totsqm': 0.48}
              },
            'sdhm': 
              {
                'rsdn':{'dilpd': 184.63, 'cilpd': 722.71, 'tipd': 907.34},
                'retl':{'devsqm': 5.43, 'comsqm': 0.00, 'totsqm': 5.43},
                'comm':{'devsqm': 2.00, 'comsqm': 0.00, 'totsqm': 2.00},
                'inds':{'devsqm': 0.48, 'comsqm': 0.00, 'totsqm': 0.48}
              },
            'cdpk': 
              {
                'rsdn':{'dilpd': 172.71, 'cilpd': 722.71, 'tipd': 895.42},
                'retl':{'devsqm': 4.53, 'comsqm': 0.00, 'totsqm': 4.53},
                'comm':{'devsqm': 1.99, 'comsqm': 0.00, 'totsqm': 1.99},
                'inds':{'devsqm': 0.42, 'comsqm': 0.00, 'totsqm': 0.42}
              },
            'kllg':
              {
                'rsdn':{'dilpd': 172.71, 'cilpd': 722.71, 'tipd': 895.42},
                'retl':{'devsqm': 4.53, 'comsqm': 0.00, 'totsqm': 4.53},
                'comm':{'devsqm': 1.99, 'comsqm': 0.00, 'totsqm': 1.99},
                'inds':{'devsqm': 0.42, 'comsqm': 0.00, 'totsqm': 0.42}
              },
            'klnt':
              {
                'rsdn':{'dilpd': 172.71, 'cilpd': 722.71, 'tipd': 895.42},
                'retl':{'devsqm': 4.53, 'comsqm': 0.00, 'totsqm': 4.53},
                'comm':{'devsqm': 1.99, 'comsqm': 0.00, 'totsqm': 1.99},
                'inds':{'devsqm': 0.42, 'comsqm': 0.00, 'totsqm': 0.42}
              },
            'tlws':
              {
                'rsdn':{'dilpd': 172.71, 'cilpd': 722.71, 'tipd': 895.42},
                'retl':{'devsqm': 4.53, 'comsqm': 0.00, 'totsqm': 4.53},
                'comm':{'devsqm': 1.99, 'comsqm': 0.00, 'totsqm': 1.99},
                'inds':{'devsqm': 0.42, 'comsqm': 0.00, 'totsqm': 0.42}
              },
            'kelr':
              {
                'rsdn':{'dilpd': 121.18, 'cilpd': 714.21, 'tipd': 835.39},
                'retl':{'devsqm': 2.23, 'comsqm': 0.00, 'totsqm': 2.23},
                'comm':{'devsqm': 1.95, 'comsqm': 0.00, 'totsqm': 1.95},
                'inds':{'devsqm': 0.25, 'comsqm': 0.00, 'totsqm': 0.25}
              },
            'tles': 
              {
                'rsdn':{'dilpd': 121.18, 'cilpd': 714.21, 'tipd': 835.39},
                'retl':{'devsqm': 2.23, 'comsqm': 0.00, 'totsqm': 2.23},
                'comm':{'devsqm': 1.95, 'comsqm': 0.00, 'totsqm': 1.95},
                'inds':{'devsqm': 0.25, 'comsqm': 0.00, 'totsqm': 0.25}
              },
            'dlhy': 
              {
                'rsdn':{'dilpd': 254.85, 'cilpd': 864.88, 'tipd': 1119.73},
                'retl':{'devsqm': 5.20, 'comsqm': 0.00, 'totsqm': 5.20},
                'comm':{'devsqm': 3.75, 'comsqm': 0.00, 'totsqm': 3.75},
                'inds':{'devsqm': 0.55, 'comsqm': 0.00, 'totsqm': 0.55}
              },
            'kldw':
              {
                'rsdn':{'dilpd': 204.26, 'cilpd': 847.94, 'tipd': 1052.20},
                'retl':{'devsqm': 3.55, 'comsqm': 0.00, 'totsqm': 3.55},
                'comm':{'devsqm': 3.02, 'comsqm': 0.00, 'totsqm': 3.02},
                'inds':{'devsqm': 0.40, 'comsqm': 0.00, 'totsqm': 0.40}
              },
            'kles':
              {
                'rsdn':{'dilpd': 92.52, 'cilpd': 714.21, 'tipd': 806.73},
                'retl':{'devsqm': 1.77, 'comsqm': 0.00, 'totsqm': 1.77},
                'comm':{'devsqm': 1.39, 'comsqm': 0.00, 'totsqm': 1.39},
                'inds':{'devsqm': 0.19, 'comsqm': 0.00, 'totsqm': 0.19}
              },
            'klpr':
              {
                'rsdn':{'dilpd': 92.52, 'cilpd': 714.21, 'tipd': 806.73},
                'retl':{'devsqm': 1.77, 'comsqm': 0.00, 'totsqm': 1.77},
                'comm':{'devsqm': 1.39, 'comsqm': 0.00, 'totsqm': 1.39},
                'inds':{'devsqm': 0.19, 'comsqm': 0.00, 'totsqm': 0.19}
              },
            'tlmn':
              {
                'rsdn':{'dilpd': 92.52, 'cilpd': 714.21, 'tipd': 806.73},
                'retl':{'devsqm': 1.77, 'comsqm': 0.00, 'totsqm': 1.77},
                'comm':{'devsqm': 1.39, 'comsqm': 0.00, 'totsqm': 1.39},
                'inds':{'devsqm': 0.19, 'comsqm': 0.00, 'totsqm': 0.19}
              },
            'knpr':
              {
                'rsdn':{'dilpd': 170.96, 'cilpd': 864.88, 'tipd': 1035.84},
                'retl':{'devsqm': 1.93, 'comsqm': 0.00, 'totsqm': 1.93},
                'comm':{'devsqm': 2.71, 'comsqm': 0.00, 'totsqm': 2.71},
                'inds':{'devsqm': 0.27, 'comsqm': 0.00, 'totsqm': 0.27}
              },
            'sawa':
              {
                'rsdn':{'dilpd': 527.74, 'cilpd': 1092.88, 'tipd': 1620.62},
                'retl':{'devsqm': 4.92, 'comsqm': 0.00, 'totsqm': 4.92},
                'comm':{'devsqm': 5.49, 'comsqm': 0.00, 'totsqm': 5.49},
                'inds':{'devsqm': 0.62, 'comsqm': 0.00, 'totsqm': 0.62}
              },
            'saea':
              {
                'rsdn':{'dilpd': 495.26, 'cilpd': 1075.94, 'tipd': 1571.20},
                'retl':{'devsqm': 4.83, 'comsqm': 0.00, 'totsqm': 4.83},
                'comm':{'devsqm': 5.03, 'comsqm': 0.00, 'totsqm': 5.03},
                'inds':{'devsqm': 0.59, 'comsqm': 0.00, 'totsqm': 0.59}
              },
            'klba': 
              {
                'rsdn':{'dilpd': 154.14, 'cilpd': 847.94, 'tipd': 1002.08},
                'retl':{'devsqm': 2.72, 'comsqm': 0.00, 'totsqm': 2.72},
                'comm':{'devsqm': 2.60, 'comsqm': 0.00, 'totsqm': 2.60},
                'inds':{'devsqm': 0.32, 'comsqm': 0.00, 'totsqm': 0.32}
              },
            'albv':
              {
                'rsdn':{'dilpd': 424.68, 'cilpd': 864.88, 'tipd': 1289.56},
                'retl':{'devsqm': 5.87, 'comsqm': 0.00, 'totsqm': 5.87},
                'comm':{'devsqm': 7.70, 'comsqm': 0.00, 'totsqm': 7.70},
                'inds':{'devsqm': 0.80, 'comsqm': 0.00, 'totsqm': 0.80}
              },
            'crnl':
              {
                'rsdn':{'dilpd': 453.06, 'cilpd': 950.47, 'tipd': 1403.53},
                'retl':{'devsqm': 4.40, 'comsqm': 0.00, 'totsqm': 4.40},
                'comm':{'devsqm': 5.67, 'comsqm': 0.00, 'totsqm': 5.67},
                'inds':{'devsqm': 0.59, 'comsqm': 0.00, 'totsqm': 0.59}
              },
            'drpk':
              {
                'rsdn':{'dilpd': 552.91, 'cilpd': 950.47, 'tipd': 1503.38},
                'retl':{'devsqm': 6.17, 'comsqm': 0.00, 'totsqm': 6.17},
                'comm':{'devsqm': 8.11, 'comsqm': 0.00, 'totsqm': 8.11},
                'inds':{'devsqm': 0.84, 'comsqm': 0.00, 'totsqm': 0.84}
              },
            'ardr':
              {
                'rsdn':{'dilpd': 254.66, 'cilpd': 675.06, 'tipd': 929.72},
                'retl':{'devsqm': 1.97, 'comsqm': 0.00, 'totsqm': 1.97},
                'comm':{'devsqm': 2.34, 'comsqm': 0.00, 'totsqm': 2.34},
                'inds':{'devsqm': 0.25, 'comsqm': 0.00, 'totsqm': 0.25}
              },
            'albn':
              {
                'rsdn':{'dilpd': 232.64, 'cilpd': 675.06, 'tipd': 907.70},
                'retl':{'devsqm': 1.84, 'comsqm': 0.00, 'totsqm': 1.84},
                'comm':{'devsqm': 1.84, 'comsqm': 0.00, 'totsqm': 1.84},
                'inds':{'devsqm': 0.22, 'comsqm': 0.00, 'totsqm': 0.22}
              },
            'ssnt':
              {
                'rsdn':{'dilpd': 218.74, 'cilpd': 653.88, 'tipd': 872.62},
                'retl':{'devsqm': 4.78, 'comsqm': 0.00, 'totsqm': 4.78},
                'comm':{'devsqm': 3.77, 'comsqm': 0.00, 'totsqm': 3.77},
                'inds':{'devsqm': 0.52, 'comsqm': 0.00, 'totsqm': 0.52}
              },
            'drmt':
              {
                'rsdn':{'dilpd': 129.74, 'cilpd': 714.21, 'tipd': 843.95},
                'retl':{'devsqm': 1.90, 'comsqm': 0.00, 'totsqm': 1.90},
                'comm':{'devsqm': 2.58, 'comsqm': 0.00, 'totsqm': 2.58},
                'inds':{'devsqm': 0.26, 'comsqm': 0.00, 'totsqm': 0.26}
              },
            'sswt': 
              {
                'rsdn':{'dilpd': 362.10, 'cilpd': 737.97, 'tipd': 1100.07},
                'retl':{'devsqm': 4.04, 'comsqm': 0.00, 'totsqm': 4.04},
                'comm':{'devsqm': 4.61, 'comsqm': 0.00, 'totsqm': 4.61},
                'inds':{'devsqm': 0.51, 'comsqm': 0.00, 'totsqm': 0.51}
              },
            'ssab':
              {
                'rsdn':{'dilpd': 341.39, 'cilpd': 737.97, 'tipd': 1079.36},
                'retl':{'devsqm': 3.98, 'comsqm': 0.00, 'totsqm': 3.98},
                'comm':{'devsqm': 4.13, 'comsqm': 0.00, 'totsqm': 4.13},
                'inds':{'devsqm': 0.49, 'comsqm': 0.00, 'totsqm': 0.49}
              },
            'sstc':
              {
                'rsdn':{'dilpd': 2764.00, 'cilpd': 0.00, 'tipd': 2764.00},
                'retl':{'devsqm': 38.00, 'comsqm': 0.00, 'totsqm': 38.00},
                'comm':{'devsqm': 29.00, 'comsqm': 0.00, 'totsqm': 29.00},
                'inds':{'devsqm': 0.00, 'comsqm': 0.00, 'totsqm': 0.00}
              }
          },
          damaged: null,
          isIncrease: null,
          damagedIncreasedFloor: null,
          vacant: null,
          vacantLandFloor: null,
          buildingType: null,
          buildingFloorIncreased: null,
          buildingFloorNew: null,
          calculatedTotal: null,
          showCalculate: null,
          calculationType: null,
          calculatedDil: 0,
          calculatedCil: 0,
          showResultBlock: false,
          showResult: false
        }
      },
      methods: {
        resetValues: function () {
          this.selectedSuburb = null
          this.selectedDevelopmentType = null
          this.dwellings = 0
          this.totalDwellings = 0
          this.damaged = null
          this.isIncrease = null
          this.damagedIncreasedFloor = null
          this.vacant = null
          this.vacantLandFloor = null
          this.buildingType = null
          this.buildingFloorIncreased = null
          this.buildingFloorNew = null
          this.calculatedTotal = null
          this.showCalculate = false
          this.calculationType = null
          this.calculatedCil = 0
          this.calculatedDil = 0
          this.showResultBlock = false
          this.showResult = false
        },
        partialReset: function () {          
          this.dwellings = 0
          this.totalDwellings = 0
          this.damaged = null
          this.isIncrease = null
          this.damagedIncreasedFloor = null
          this.vacantLandFloor = null
          this.buildingType = null
          this.buildingFloorIncreased = null
          this.buildingFloorNew = null
          this.calculatedTotal = null
          this.showCalculate = false
          this.calculationType = null
          this.calculatedCil = 0
          this.calculatedDil = 0
          this.vacant = null
          this.showResultBlock = false
          this.showResult = false
        },
        resetResultVacant: function () {
          if (this.showCalculate === false) {
            this.showCalculate = null
            this.calculationType = null
          }
        },
        calculate: function () {
           if (this.calculationType === 'rsdn') {
             this.updateResidential()
           }
           else {
             if (this.vacant === '1') {
               //vacantland Yes;
               this.updateVacantLand();
             }
             else if (this.vacant === '0'
                        && this.damaged === '1'
                            && this.isIncrease === '0'){
               //vacant no, damage yes, increase no;
               this.updateToNull();
             }
             else if (this.vacant === '0'
                        && this.damaged === '1'
                            && this.isIncrease === '1') {
               //vacant no, damage yes, increased yes;
               this.updateDamagedIncreased();
             }
             else if (this.vacant === '0'
                        && this.damaged === '0'
                            && this.buildingType['value'] !== null) {
               //vacant no, damage no, building type not null;
               this.updateBuildingFloor();
             }
           }
        },
        checkVisDevType: function () {
          if (this.selectedDevelopmentType
                && this.selectedDevelopmentType['value']) {
            return this.selectedDevelopmentType['value'] !== null;
          }
        },
        checkVisSuburb: function () {
          if (this.selectedSuburb
            && this.selectedSuburb['value']) {
            return this.selectedSuburb['value'] !== null;
          }
        },
        checkVisDwellings: function () {
          if (this.selectedSuburb
                && this.selectedSuburb['value']
                    && this.selectedDevelopmentType
                        && this.selectedDevelopmentType['value']) {
            return this.selectedDevelopmentType['value'] === 'rsdn';
          }
        },
        checkVisTotalDwelling: function () {
          if (this.selectedSuburb
            && this.selectedSuburb['value']
            && this.selectedDevelopmentType
            && this.selectedDevelopmentType['value']) {
            return (this.selectedDevelopmentType['value'] === 'rsdn'
                     && this.totalDwellings !== 0);
          }
        },
        checkVisIsVacant: function () {
          if (this.selectedSuburb
                && this.selectedSuburb['value']
                    && this.selectedDevelopmentType
                        && this.selectedDevelopmentType['value']) {
            return (this.selectedDevelopmentType['value']=== 'retl'
                        || this.selectedDevelopmentType['value'] === 'comm'
                            || this.selectedDevelopmentType['value'] === 'inds');
          }
        },
        checkVisVacantLand: function () {
          if (this.selectedDevelopmentType
                && this.selectedDevelopmentType['value']) {
            return (this.selectedDevelopmentType['value'] !== 'rsdn'
              && this.vacant === '1');
          }
        },
        checkVisDamaged: function () {
          if (this.selectedDevelopmentType
                && this.selectedDevelopmentType['value']) {
            return (this.selectedDevelopmentType['value'] !== 'rsdn'
                        && this.vacant === '0');
          }
        },
        checkVisIsIncrease: function () {
          if (this.selectedDevelopmentType
                && this.selectedDevelopmentType['value']) {
            return (this.selectedDevelopmentType['value'] !== 'rsdn'
                        && this.vacant === '0'
                            && this.damaged === '1');
          }
        },
        checkVisDamagedIncreased: function () {
          if (this.selectedDevelopmentType
                && this.selectedDevelopmentType['value']) {
            return (this.selectedDevelopmentType['value'] !== 'rsdn'
                        && this.vacant === '0'
                            && this.damaged === '1'
                                && this.isIncrease === '1');
          }
        },
        checkVisBuildingType: function () {
          if (this.selectedDevelopmentType
                && this.selectedDevelopmentType['value']) {
            return ((this.selectedDevelopmentType['value'] !== null
                        || this.selectedDevelopmentType['value'] !== 'rsdn')
                            && this.vacant === '0'
                                && this.damaged === '0');
          }
        },
        checkVisBuildingFloor: function (type = null) {
          if (this.selectedDevelopmentType
                && this.selectedDevelopmentType['value']) {
            switch (type) {
              case 'new':
                return (this.selectedDevelopmentType['value'] !== 'rsdn'
                  && this.vacant === '0'
                  && this.damaged === '0'
                  && this.buildingType === 'new');
              default:
                return (this.selectedDevelopmentType !== 'rsdn'
                  && this.vacant === '0'
                  && this.damaged === '0'
                  && (this.buildingType === 'exist'
                    || this.buildingType === 'both'));
            }
          }
        },
        updateDwelling: function (value) {
          this.dwellings = this.toPositive(value);
          this.showCalculate = true;
          this.showResultBlock = false;
          this.calculationType = 'rsdn';
        },
        updateTotalDwelling: function (value) {
          this.totalDwellings = this.toPositive(value);
          this.calculatedTotal = 0;
          this.showCalculate = true;
          this.showResultBlock = false;
          this.calculationType = 'rsdn';
          this.updateTotal();
        },
        toPositive: function (value) {
          return Math.abs(value)
        },
        updateVacant: function (value) {
          if (value === '1') {
            this.showCalculate = true;
            this.calculationType = 'other';
          }
          else if(value === '0') {
            this.vacantLandFloor = null;
            this.showCalculate = false;
            this.calculationType = null;
            this.calculatedCil = 0;
            this.calculatedDil = 0;
            this.calculatedTotal = null;
            this.damaged = null;
            this.isIncrease = null;
            this.damagedIncreasedFloor = null;
            this.buildingType = null;
            this.showResultBlock = false;
          }
        },
        updateVacantLandFloor: function () {
          this.vacantLandFloor = Math.abs(this.vacantLandFloor);
          this.updateTotal();
        },
        updateDamagedIncreasedFloor: function () {
          this.damagedIncreasedFloor = Math.abs(this.damagedIncreasedFloor)
          this.updateTotal()
        },
        updateBuildingFloorIncreased: function () {
          this.buildingFloorIncreased = Math.abs(this.buildingFloorIncreased)
          this.updateTotal()
        },
        updateBuildingFloorNew: function () {
          this.buildingFloorNew = Math.abs(this.buildingFloorNew)
          this.updateTotal()
        },
        updateTotal: function () {
          if (this.selectedSuburb
            && this.selectedDevelopmentType) {
            switch (this.selectedDevelopmentType['value']) {
              case 'rsdn':
                if (this.totalDwellings !== null && this.totalDwellings < 0) {
                  this.totalDwellings = Math.abs(this.totalDwellings)
                }
                this.calculationType = 'rsdn'
                break;
              case 'comm':
              case 'inds':
              case 'retl':
                this.showCalculate = true;
                this.calculationType = 'other';
                this.calculatedTotal = 0;
                break;
            }
          }

        },
        getRates: function () {
          return this.rates[this.selectedSuburb['value']]
        },
        updateResidential: function () {
          let newDwellings = this.totalDwellings - this.dwellings;
          if (newDwellings < 0) {
            newDwellings = 0;
          }
          if (newDwellings !== 0) {
            let rates = this.getRates();
            let dil = parseFloat(rates.rsdn['dilpd']) * newDwellings;
            let cil = parseFloat(rates.rsdn['cilpd']) * newDwellings;
            this.calculatedDil = dil.toFixed(2);
            this.calculatedCil = cil.toFixed(2);
            let result = dil + cil;
            this.calculatedTotal = result.toFixed(2);
            this.showResultBlock = true;
            this.showResult = true;
          }
          else {
            this.calculatedTotal = 0;
            this.showResultBlock = true;
            this.showResult = false;
          }
        },
        updateVacantLand: function () {
          let rates = this.getRates();
          let type = this.selectedDevelopmentType['value'];
          let newArea = this.vacantLandFloor;
          let dil = parseFloat(rates[type]['devsqm']) * newArea;
          let cil = parseFloat(rates[type]['comsqm']) * newArea;
          this.calculatedDil = dil.toFixed(2);
          this.calculatedCil = cil.toFixed(2);
          let result = dil + cil;
          if (result > 0){
            this.calculatedTotal = result.toFixed(2);
          }
          else {
            this.calculatedTotal = null;
          }
          this.processResult();
        },
        updateToNull: function () {
          this.calculatedTotal = 0;
        },
        updateDamagedIncreased: function () {
          let rates = this.getRates();
          let type = this.selectedDevelopmentType['value'];
          let floor = this.damagedIncreasedFloor;
          let dil = rates[type]['devsqm'] * floor;
          let cil = rates[type]['comsqm'] * floor;
          this.calculatedDil = dil.toFixed(2);
          this.calculatedCil = cil.toFixed(2);
          let result = dil + cil;
          if (result > 0){
            this.calculatedTotal = result.toFixed(2);
          }
          else {
            this.calculatedTotal = null;
          }
          this.processResult();
        },
        updateBuildingFloor: function () {
          let rates = this.getRates();
          let type = this.selectedDevelopmentType['value'];
          let floor;
          switch (this.buildingType) {
            case 'new':
              floor = this.buildingFloorNew;
              break;
            default:
              floor = this.buildingFloorIncreased;
              break;
          }
          let dil = rates[type]['devsqm'] * floor;
          let cil = rates[type]['comsqm'] * floor;
          this.calculatedDil = dil.toFixed(2);
          this.calculatedCil = cil.toFixed(2);
          let result = dil + cil;
          if (result > 0){
            this.calculatedTotal = result.toFixed(2);
          }
          else {
            this.calculatedTotal = null;
          }
          this.processResult();
        },
        updateYesIncrease: function () {
          if (this.isIncrease ) {
            this.showCalculate = true;
            this.calculationType = 'other';
            this.showResultBlock = false;
          }
        },
        updateNoIncrease: function () {
          if (this.isIncrease === '0') {
            this.damagedIncreasedFloor = null
            this.calculatedTotal = null;
            this.showCalculate = false;
            this.showResultBlock = true;
            this.showResult = false;
          }
        },
        updateNew: function (){
          if (this.buildingType === 'new') {
            this.buildingFloorIncreased = null
            this.showCalculate = true;
            this.calculationType = 'other';
            this.showResultBlock = false;
          }
        },
        updateBoth: function (){
          if (this.buildingType === 'both' || this.buildingType === 'exist') {
            this.buildingFloorNew = null
            this.showCalculate = true;
            this.calculationType = 'other';
            this.showResultBlock = false;
          }
        },
        processResult: function () {
          if (this.calculatedTotal !== null) {
            this.showResultBlock = true;
            this.showResult = true;
          }
          else {
            this.showResultBlock = true;
            this.showResult = false;
          }
        },
        updateUnintentionalDamage: function (value) {
          switch (value) {
            case '1':
              this.buildingType = null;
              this.buildingFloorNew = null;
              this.buildingFloorIncreased = null
              this.showResultBlock = false;
              break;
            default:
              this.isIncrease = null;
              this.buildingFloorIncreased = null
              this.showResultBlock = false;
              break;
          }
        },
        updateResultDwellings: function () {
          this.showCalculate = true;
          this.showResultBlock = false;
          this.calculationType = 'rsdn';
        }
      },
      computed: {
        suburbLabel: function () {
          if (this.selectedSuburb) {
            let selected = this.selectedSuburb['value'];
            let suburbElement = this.suburbs.filter(function(suburb){
              return suburb.value === selected;
            });
            return suburbElement[0].label;
          }
          else {
            return 'not selected'
          }
        },
        typeLabel: function () {
          if (this.selectedDevelopmentType) {
            let selectedType = this.selectedDevelopmentType['value'];
            let type = this.developmentTypes.filter(function (type) {
              return type.value === selectedType;
            });
            return type[0].label;
          }
          else {
            return 'not selected'
          }
        },
        buildingTypeLabel: function () {
          switch (this.buildingType) {
            case 'exist':
              return '<strong>Are you extending the existing building?</strong> Yes';
            case 'new':
              return '<strong>Are you constructing a new building?</strong> Yes';
            case 'both':
              return '<strong>Are you extending the existing building and constructing a new building/s?</strong> Yes';
          }
        }
      },
      filters: {
        tostring: function (value) {
          switch (value) {
            case '0':
              return 'No';
            case '1':
              return 'Yes';
          }
        },
        currency: function (value) {
          let val = (value/1).toFixed(2).replace(',', '.')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
      },
      watch: {
        selectedDevelopmentType: function () {
           this.partialReset();
           if (this.selectedSuburb !== null
                && this.selectedSuburb['value']
                    && this.selectedDevelopmentType !== null
                        && this.selectedDevelopmentType['value'] === 'rsdn') {
             this.showCalculate = true;
             this.calculationType = 'rsdn';
           }
        },
        selectedSuburb: function () {
          if (this.selectedSuburb !== null
                && this.selectedSuburb['value']
                    && this.selectedDevelopmentType !== null
                        && this.selectedDevelopmentType['value'] === 'rsdn') {
            this.showCalculate = true;
            this.calculationType = 'rsdn';
          }
        }
      }
    }
</script>
