import {deleteObjectiveAnalysis} from '@/services/data/tuples/objective-analysis';
import {
	ObjectiveAnalysis,
	ObjectiveAnalysisPerspective,
	ObjectiveAnalysisPerspectiveType
} from '@/services/data/tuples/objective-analysis-types';
import {generateUuid} from '@/services/data/tuples/utils';
import {RoundDwarfButton} from '@/widgets/basic/button';
import {ICON_OBJECTIVE_ANALYSIS} from '@/widgets/basic/constants';
import {ButtonInk} from '@/widgets/basic/types';
import {useForceUpdate} from '@/widgets/basic/utils';
import {useEventBus} from '@/widgets/events/event-bus';
import {EventTypes} from '@/widgets/events/types';
import {Lang} from '@/widgets/langs';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useEffect} from 'react';
import {useObjectiveAnalysisEventBus} from '../objective-analysis-event-bus';
import {ObjectiveAnalysisEventTypes} from '../objective-analysis-event-bus-types';
import {useNavigatorVisible} from '../use-navigator-visible';
import {NameEditor} from './name-editor';
import {Perspective} from './perspective';
import {ObjectiveAnalysisSaver} from './saver';
import {useDescription} from './use-description';
import {
	AnalysisDescriptor,
	AnalysisDescriptorWrapper,
	EditorBody,
	EditorContainer,
	EditorHeader,
	EditorHeaderButtons
} from './widgets';

export const Picked = (props: { analysis: ObjectiveAnalysis }) => {
	const {analysis} = props;

	const {fire: fireGlobal} = useEventBus();
	const {on, off, fire} = useObjectiveAnalysisEventBus();
	const navigatorVisible = useNavigatorVisible();
	const forceUpdate = useForceUpdate();
	const {onDescriptionChanged, onDescriptionBlurred} = useDescription(analysis, analysis);
	useEffect(() => {
		const onDeletePerspective = (anAnalysis: ObjectiveAnalysis, perspective: ObjectiveAnalysisPerspective) => {
			if (anAnalysis !== analysis) {
				return;
			}

			analysis.perspectives = (analysis.perspectives || []).filter(p => p !== perspective);
			fire(ObjectiveAnalysisEventTypes.SAVE, analysis);
			forceUpdate();
		};
		on(ObjectiveAnalysisEventTypes.DELETE_PERSPECTIVE, onDeletePerspective);
		return () => {
			off(ObjectiveAnalysisEventTypes.DELETE_PERSPECTIVE, onDeletePerspective);
		};
	}, [on, off, fire, forceUpdate, analysis]);

	const onAddInspectionClicked = () => {
		analysis.perspectives = analysis.perspectives ?? [];
		analysis.perspectives.push({
			perspectiveId: generateUuid(),
			type: ObjectiveAnalysisPerspectiveType.INSPECTION
		});
		fire(ObjectiveAnalysisEventTypes.SAVE, analysis);
		forceUpdate();
	};
	const onAddAchievementClicked = () => {
		analysis.perspectives = analysis.perspectives ?? [];
		analysis.perspectives.push({
			perspectiveId: generateUuid(),
			type: ObjectiveAnalysisPerspectiveType.ACHIEVEMENT
		});
		fire(ObjectiveAnalysisEventTypes.SAVE, analysis);
		forceUpdate();
	};
	const onDeleteClicked = () => {
		fireGlobal(EventTypes.SHOW_YES_NO_DIALOG,
			Lang.INDICATOR.OBJECTIVE_ANALYSIS.DELETE_DIALOG_LABEL,
			() => {
				fireGlobal(EventTypes.INVOKE_REMOTE_REQUEST, async () => {
					await deleteObjectiveAnalysis(analysis);
				}, () => {
					fire(ObjectiveAnalysisEventTypes.DELETED, analysis);
					fireGlobal(EventTypes.HIDE_DIALOG);
				});
			},
			() => fireGlobal(EventTypes.HIDE_DIALOG));
	};

	return <EditorContainer>
		<ObjectiveAnalysisSaver analysis={analysis}/>
		<EditorHeader navigatorVisible={navigatorVisible}>
			<NameEditor analysis={analysis}/>
			<EditorHeaderButtons>
				<RoundDwarfButton ink={ButtonInk.PRIMARY} onClick={onAddInspectionClicked}>
					{Lang.INDICATOR.OBJECTIVE_ANALYSIS.ADD_INSPECTION}
				</RoundDwarfButton>
				<RoundDwarfButton ink={ButtonInk.PRIMARY} onClick={onAddAchievementClicked}>
					{Lang.INDICATOR.OBJECTIVE_ANALYSIS.ADD_ACHIEVEMENT}
				</RoundDwarfButton>
				<RoundDwarfButton ink={ButtonInk.DANGER} onClick={onDeleteClicked}>
					{Lang.ACTIONS.DELETE}
				</RoundDwarfButton>
			</EditorHeaderButtons>
		</EditorHeader>
		<EditorBody>
			<AnalysisDescriptorWrapper>
				<FontAwesomeIcon icon={ICON_OBJECTIVE_ANALYSIS}/>
				<AnalysisDescriptor value={analysis.description ?? ''}
				                    onChange={onDescriptionChanged} onBlur={onDescriptionBlurred}
				                    placeholder={Lang.PLAIN.OBJECTIVE_ANALYSIS_DESCRIPTION_PLACEHOLDER}/>
			</AnalysisDescriptorWrapper>
			{(analysis.perspectives || []).map(perspective => {
				return <Perspective analysis={analysis} perspective={perspective} key={perspective.perspectiveId}/>;
			})}
		</EditorBody>
	</EditorContainer>;
};