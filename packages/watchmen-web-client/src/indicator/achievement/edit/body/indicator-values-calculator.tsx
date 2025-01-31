import {Achievement, AchievementIndicator} from '@/services/data/tuples/achievement-types';
import {isXaNumber} from '@/services/utils';
import {useForceUpdate} from '@/widgets/basic/utils';
import {Fragment, useEffect, useState} from 'react';
import {useAchievementEditEventBus} from './achievement-edit-event-bus';
import {AchievementEditEventTypes} from './achievement-edit-event-bus-types';
import {CalculatedIndicatorValues, IndicatorValues} from './types';

export const toNumber = (x: any): number | '' => {
	if (x == null || !isXaNumber(x)) {
		return '';
	}
	try {
		const v = Number(x);
		return Number.isNaN(v) ? '' : v;
	} catch {
		return '';
	}
};

export const formatToNumber = (x: any, fractionDigits: number = 2) => {
	const v = toNumber(x);
	return v === '' ? '' : new Intl.NumberFormat(undefined, {
		useGrouping: true,
		maximumFractionDigits: fractionDigits,
		minimumFractionDigits: fractionDigits
	}).format(v);
};

export const computeRatio = (currentValue: any, previousValue: any): number => {
	const current = toNumber(currentValue);
	const previous = toNumber(previousValue);
	if (current === '') {
		return 0;
	} else if (previous === '' || previous === 0) {
		return 100;
	} else {
		return (current - previous) / previous * 100;
	}
};

export type ComputedScore = { ratio: number, score?: number, useScore: boolean, error?: string };
// interpolation(r, 0.1, 10, 0.5, 100)
export const interpolation = (value: any, min: number, minScore: number, max: number, maxScore: number) => {
	const v = toNumber(value);
	if (v === '') {
		// not a number, score 0
		return minScore ?? 0;
	}

	if (v <= min) {
		return minScore ?? 0;
	} else if (v >= max) {
		return maxScore;
	} else {
		return (minScore ?? 0) + Number(((maxScore - minScore) * (v - min) / (max - min)).toFixed(1));
	}
};

const doComputeScore = (options: { script: string, current?: number, previous?: number, ratio: number }): { score?: number, error?: string } => {
	const {script, current, previous, ratio} = options;

	try {
		const mathFunctionNames = Object.getOwnPropertyNames(Math);
		const runScript = script.split('\n')
			.filter(x => x != null && x.trim().length !== 0)
			.map((line, index, lines) => {
				return lines.length === index + 1 ? `return ${line}` : line;
			}).join('\n');
		const args = ['c', 'p', 'r', ...mathFunctionNames, 'interpolation', runScript];
		// eslint-disable-next-line
		const func = new Function(...args);
		const params = [
			current, previous, ratio / 100,
			// @ts-ignore
			...mathFunctionNames.map(name => Math[name]),
			interpolation
		];
		return {score: func(...params)};
	} catch (e: any) {
		console.groupCollapsed('Achievement Indicator Formula Script Error');
		console.error(e);
		console.groupEnd();
		return {error: e.message || 'Achievement Indicator Formula Script Error.'};
	}
};

const shouldComputeScore = (script?: string) => {
	return script != null && script.trim().length !== 0;
};
const computeScore = (options: {
	script?: string;
	current?: number;
	previous?: number;
}): ComputedScore => {
	const {script, current, previous} = options;
	const ratio = computeRatio(current, previous);

	const useScore = shouldComputeScore(script);
	if (useScore) {
		const score = doComputeScore({script: script!, current, previous, ratio});
		return {ratio, useScore: true, ...score};
	} else {
		return {ratio, useScore: false};
	}
};

const asValuePair = (value?: number, fractionDigits: number = 2): { value: number, formatted: string } | undefined => {
	if (value == null) {
		return (void 0);
	}

	return {value, formatted: formatToNumber(value, fractionDigits)};
};

const doCompute = (achievementIndicator: AchievementIndicator, values: IndicatorValues): CalculatedIndicatorValues => {
	if (!values.loaded) {
		return {
			loaded: false,
			loadFailed: false,
			calculated: false,
			calculateFailed: false,
			shouldComputeScore: shouldComputeScore(achievementIndicator.formula)
		};
	} else if (values.failed) {
		return {
			loaded: true,
			loadFailed: true,
			calculated: false,
			calculateFailed: false,
			shouldComputeScore: shouldComputeScore(achievementIndicator.formula)
		};
	} else {
		const {ratio, useScore, score, error} = computeScore({
			script: achievementIndicator.formula,
			current: values.current,
			previous: values.previous
		});
		return {
			loaded: true,
			loadFailed: false,
			calculated: true,
			calculateFailed: error != null && error.trim().length !== 0,
			calculateFailureReason: error,
			current: asValuePair(values.current),
			previous: asValuePair(values.previous),
			ratio: asValuePair(ratio),
			score: asValuePair(score, 1),
			shouldComputeScore: useScore
		};
	}
};

/**
 * calculate {@link CalculatedIndicatorValues} on
 * 1. {@link AchievementEditEventTypes#VALUES_CHANGED},
 * 2. {@link AchievementEditEventTypes#INDICATOR_FORMULA_CHANGED}.
 * only used on non-compute indicator
 */
export const IndicatorValuesCalculator = (props: { achievement: Achievement, achievementIndicator: AchievementIndicator }) => {
	const {achievement, achievementIndicator} = props;

	const {on, off, fire} = useAchievementEditEventBus();
	const [calculatedValues, setCalculatedValues] = useState<CalculatedIndicatorValues>({
		loaded: false,
		loadFailed: false,
		calculated: false,
		calculateFailed: false,
		shouldComputeScore: shouldComputeScore(achievementIndicator.formula)
	});
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		fire(AchievementEditEventTypes.VALUES_CALCULATED, achievement, achievementIndicator, calculatedValues);
	}, [fire, achievement, achievementIndicator, calculatedValues]);
	useEffect(() => {
		const onValuesChanged = (aAchievement: Achievement, aAchievementIndicator: AchievementIndicator, values: IndicatorValues) => {
			if (aAchievement !== achievement || aAchievementIndicator !== achievementIndicator) {
				return;
			}

			// calculate since indicator values changed
			setCalculatedValues(doCompute(achievementIndicator, values));
		};
		on(AchievementEditEventTypes.VALUES_CHANGED, onValuesChanged);
		return () => {
			off(AchievementEditEventTypes.VALUES_CHANGED, onValuesChanged);
		};
	}, [on, off, achievement, achievementIndicator]);
	useEffect(() => {
		const onFormulaChanged = (aAchievement: Achievement, aAchievementIndicator: AchievementIndicator) => {
			if (aAchievement !== achievement || aAchievementIndicator !== achievementIndicator) {
				return;
			}

			// recalculate since formula changed
			if (calculatedValues.loaded && !calculatedValues.loadFailed) {
				setCalculatedValues(doCompute(achievementIndicator, {
					loaded: true,
					failed: false,
					current: calculatedValues.current?.value,
					previous: calculatedValues.previous?.value
				}));
			}
		};
		on(AchievementEditEventTypes.INDICATOR_FORMULA_CHANGED, onFormulaChanged);
		return () => {
			off(AchievementEditEventTypes.INDICATOR_FORMULA_CHANGED, onFormulaChanged);
		};
	}, [on, off, forceUpdate, achievement, achievementIndicator, calculatedValues]);
	useEffect(() => {
		const onAskCalculatedValues = (aAchievement: Achievement, aAchievementIndicator: AchievementIndicator, onData: (values: CalculatedIndicatorValues) => void) => {
			if (aAchievement !== achievement || aAchievementIndicator !== achievementIndicator) {
				return;
			}
			onData(calculatedValues);
		};
		on(AchievementEditEventTypes.ASK_CALCULATED_VALUES, onAskCalculatedValues);
		return () => {
			off(AchievementEditEventTypes.ASK_CALCULATED_VALUES, onAskCalculatedValues);
		};
	}, [on, off, achievement, achievementIndicator, calculatedValues]);

	return <Fragment/>;
};

/**
 * handle my {@link AchievementEditEventTypes#VALUES_CALCULATED}.
 */
export const useIndicatorValuesCalculator = (achievement: Achievement, achievementIndicator: AchievementIndicator) => {
	const {on, off} = useAchievementEditEventBus();
	const [calculatedValues, setCalculatedValues] = useState<CalculatedIndicatorValues>({
		loaded: false,
		loadFailed: false,
		calculated: false,
		calculateFailed: false,
		shouldComputeScore: shouldComputeScore(achievementIndicator.formula)
	});
	useEffect(() => {
		const onValuesCalculated = (aAchievement: Achievement, aAchievementIndicator: AchievementIndicator, values: CalculatedIndicatorValues) => {
			if (achievement !== aAchievement || achievementIndicator !== aAchievementIndicator) {
				return;
			}

			setCalculatedValues(values);
		};
		on(AchievementEditEventTypes.VALUES_CALCULATED, onValuesCalculated);
		return () => {
			off(AchievementEditEventTypes.VALUES_CALCULATED, onValuesCalculated);
		};
	}, [on, off, achievement, achievementIndicator]);

	return calculatedValues;
};
