import {isFakedUuid} from '@/services/data/tuples/utils';
import {FixWidthPage} from '@/widgets/basic/page';
import {PageHeader} from '@/widgets/basic/page-header';
import {Lang} from '@/widgets/langs';
import React, {useEffect} from 'react';
import {useIndicatorsEventBus} from '../indicators-event-bus';
import {IndicatorsData, IndicatorsEventTypes} from '../indicators-event-bus-types';
import {IndicatorDeclarationStep} from '../types';
import {Categories} from './categories';
import {CreateOrFind} from './create-or-find';
import {DefineBuckets} from './define-buckets';
import {Description} from './description';
import {LastStep} from './last-step';
import {MeasureMethods} from './measure-methods';
import {PickTopic} from './pick-topic';
import {Relevant} from './relevant';
import {SaveIndicator} from './save-indicator';
import {IndicatorsContainer} from './widgets';

export const IndicatorEditor = () => {
	const {fire} = useIndicatorsEventBus();
	useEffect(() => {
		fire(IndicatorsEventTypes.ASK_INDICATOR, (data?: IndicatorsData) => {
			if (data == null || data.indicator == null) {
				fire(IndicatorsEventTypes.SWITCH_STEP, IndicatorDeclarationStep.CREATE_OR_FIND);
			} else if (isFakedUuid(data.indicator)) {
				fire(IndicatorsEventTypes.SWITCH_STEP, IndicatorDeclarationStep.PICK_TOPIC, {indicator: data.indicator});
			} else {
				fire(IndicatorsEventTypes.SWITCH_STEP, IndicatorDeclarationStep.LAST_STEP, data);
			}
		});
	}, [fire]);

	return <FixWidthPage maxWidth="80%">
		<PageHeader title={Lang.INDICATOR_WORKBENCH.INDICATOR.TITLE}/>
		<IndicatorsContainer>
			<CreateOrFind/>
			<PickTopic/>
			<MeasureMethods/>
			<DefineBuckets/>
			<SaveIndicator/>
			<Relevant/>
			<Categories/>
			<Description/>
			<LastStep/>
		</IndicatorsContainer>
	</FixWidthPage>;
};