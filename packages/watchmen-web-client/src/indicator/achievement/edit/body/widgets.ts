import styled from 'styled-components';
import {AchievementRenderMode} from '../../achievement-event-bus-types';
import {CurveRect} from './types';

export const AchievementPaletteContainer = styled.div.attrs<{ renderMode: AchievementRenderMode }>(({renderMode}) => {
	return {
		'data-widget': 'achievement-palette-container',
		'data-v-scroll': renderMode === AchievementRenderMode.EDIT ? '' : (void 0),
		'data-h-scroll': renderMode === AchievementRenderMode.EDIT ? '' : (void 0),
		style: {
			overflow: renderMode === AchievementRenderMode.EDIT ? (void 0) : 'hidden'
		}
	};
})<{ renderMode: AchievementRenderMode }>`
	display          : flex;
	position         : relative;
	flex-grow        : 1;
	background-image : radial-gradient(var(--waive-color) 1px, transparent 0);
	background-size  : 48px 48px;
	overflow         : scroll;
`;

export const AchievementPalette = styled.div.attrs<{ showAddIndicator: boolean; renderMode: AchievementRenderMode }>(
	({showAddIndicator, renderMode}) => {
		return {
			'data-widget': 'achievement-palette',
			style: {
				paddingBottom: showAddIndicator ? (void 0) : (renderMode === AchievementRenderMode.VIEW ? 'var(--margin)' : 'calc(var(--margin) * 6)'),
				display: renderMode === AchievementRenderMode.VIEW ? 'flex' : (void 0),
				flexDirection: renderMode === AchievementRenderMode.VIEW ? 'column' : (void 0),
				width: renderMode === AchievementRenderMode.VIEW ? '100%' : (void 0)
			}
		};
	})<{ showAddIndicator: boolean; renderMode: AchievementRenderMode }>`
	display               : grid;
	position              : relative;
	grid-template-columns : auto auto auto;
	padding-bottom        : calc(var(--margin) * 2.5);
	${({renderMode}) => renderMode === AchievementRenderMode.VIEW ? `
	> div[data-widget=achievement-palette-column] {
		padding: var(--margin);
		&:first-child {
			flex-direction: unset;
			justify-content: center;
			padding-bottom: 0;
		}
		&:last-child {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column-gap: var(--margin);
			grid-row-gap: calc(var(--margin) / 2);
			width: 100%;
		}
		> div[data-widget="time-range-node-container"] {
			display: none
		}
		> div[data-widget=more-indicators-container] {
			display: none
		}
		> div[data-widget=achievement-root-node] {
			width: 100%;
			border: 0;
			font-size: calc(var(--font-size) * 1.6);
			font-weight: var(--font-bold);
			font-variant: petite-caps;
			transition: box-shadow 300ms ease-in-out;
			&:before {
				opacity: 0.05;
			}
			&:hover {
				box-shadow: var(--danger-shadow);
			}
			> div {
				height: calc(var(--tall-height) * 1.5);
				&[data-widget=achievement-root-score]:before, &[data-widget=achievement-root-score]:after {
					content: '';
					border-radius: 2px;
					opacity: 0.2;
					font-size: calc(var(--font-size) * 1);
				}
				&[data-widget=achievement-root-score]:before {
					content: '<<<';
					margin-right: calc(var(--margin) / 8 * 5);
				}
				&[data-widget=achievement-root-score]:after {
					content: '>>>';
					margin-left: calc(var(--margin) / 2);
				}
				&[data-widget=achievement-root-is-ratio] {
					display: none;
				}
			}
		}
		> div[data-widget=indicator-node-container] {
			display: grid;
			grid-template-columns: 50% 50%;
			border-radius: calc(var(--border-radius) * 2);
			box-shadow: var(--shadow);
			overflow: hidden;
			transition: box-shadow 300ms ease-in-out;
			&:hover {
				box-shadow: var(--hover-shadow);
			}
			> div[data-widget=indicator-node] {
				grid-column: 2;
				border: 0;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
				width: 100%;
				justify-content: start;
				padding: 0 calc(var(--margin) / 4);
				cursor: default;
				&:before {
					display: none;
				}
				&:hover {
					border-top-right-radius: calc(var(--border-radius) * 2);
				}
				> span:first-child {
					display: none;
				}
				> span:nth-child(2) {
					display: flex;
					position: relative;
					align-items: center;
					font-size: calc(var(--font-size) * 1.2);
					font-weight: var(--font-bold);
					font-variant: petite-caps;
					height: calc(var(--tall-height) * 1.5);
					margin-top: 2px;
					margin-bottom: -2px;
					opacity: 0.5;
					&:before {
						content: '(';
						display: block;
						position: relative;
					}
					&:after {
						content: ')';
						display: block;
						position: relative;
					}
				}
				> span[data-widget=indicator-remover] {
					display: none
				}
				+ svg, + svg + span, + svg + span + div + span {
					display: none;
				}
			}
			> div[data-widget=indicator-criteria-node-container] {
				grid-row: 1;
				grid-column: 1;
				> div[data-widget=indicator-criteria-node] {
					display: flex;
					position: relative;
					border: 0;
					align-items: center;
					justify-content: end;
					justify-self: stretch;
					padding: 0 calc(var(--margin) / 4);
					font-size: calc(var(--font-size) * 1.6);
					font-weight: var(--font-bold);
					font-variant: petite-caps;
					height: calc(var(--tall-height) * 1.5);
					&:before {
						display: none;
					}
					> span[data-content] {
						visibility: hidden;
						&:after {
							content: attr(data-content);
							visibility: visible;
						}
					}
				}
				> div[data-widget=indicator-criteria-content] {
					display: none;
				}
			}
			> div[data-widget=indicator-calculation-node-container] {
				grid-column: 1 / span 2;
				> div[data-widget=indicator-calculation-node] {
					border: 0;
					border-top-left-radius: 0;
					border-top-right-radius: 0;
					cursor: default;
					&:before {
						display: none;
					}
					> span:first-child, > span:nth-child(2), > span:last-child {
						display: none;
					}
				}
				> div[data-widget=indicator-calculation-formula] {
					display: none;
				}
			}
		}
		> div[data-widget=compute-indicator-node-container] {
			flex-direction: column;
			border-radius: calc(var(--border-radius) * 2);
			box-shadow: var(--shadow);
			overflow: hidden;
			transition: box-shadow 300ms ease-in-out;
			&:hover {
				box-shadow: var(--hover-shadow);
			}
			> div[data-widget=compute-indicator-node] {
				border: 0;
				width: 100%;
				justify-self: stretch;
				cursor: default;
				&:before {
					display: none;
				}
				> span:first-child {
					display: none;
				}
				> span:nth-child(2) {
					display: flex;
					position: relative;
					align-items: center;
					font-size: calc(var(--font-size) * 1.6);
					font-weight: var(--font-bold);
					font-variant: petite-caps;
					height: calc(var(--tall-height) * 1.5);
				}
				> span[data-widget=compute-indicator-remover] {
					display: none
				}
				+ svg, + svg + div, + svg + div + span {
					display: none;
				}
			}
			> div[data-widget=compute-indicator-calculation-node-container] {
				> div[data-widget=indicator-calculation-node] {
					border: 0;
					cursor: default;
					&:before {
						display: none;
					}
					> span:first-child, > span:nth-child(2), > span:last-child {
						display: none;
					}
				}
				> div[data-widget=compute-indicator-calculation-formula] {
					display: none;
				}
			}
		}
		> div[data-widget=no-plugin-assistant][data-has-plugin=false] {
			+ div[data-widget=plugins-container] {
				display: none;
			}
		}
		> div[data-widget=plugins-container] {
			flex-direction: column;
			grid-column: 1 / span 2;
			margin-top: 0;
			> div[data-widget=plugins-root-column]:first-child {
				padding-right: 0;
				margin-bottom: calc(var(--margin) / 2);
				> div[data-widget=plugins-root-node-container] {
					align-self: stretch;
					border-radius: calc(var(--border-radius) * 2);
					transition: box-shadow 300ms ease-in-out;
					&:hover {
						box-shadow: var(--danger-shadow);
					}
					> div[data-widget=plugins-root-node] {
						border: 0;
						font-size: calc(var(--font-size) * 1.6);
						font-weight: var(--font-bold);
					}
				}
			}
			> div[data-widget=plugins-root-column]:last-child {
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: start;
				padding-left: 0;
				margin-top: calc(var(--margin) / -2);
				margin-left: calc(var(--margin) * -1);
				> div[data-widget=plugin-node-container] {
					border-radius: calc(var(--border-radius) * 2);
					box-shadow: var(--shadow);
					margin-top: calc(var(--margin) / 2);
					margin-left: var(--margin);
					overflow: hidden;
					transition: box-shadow 300ms ease-in-out;
					&[data-new-plugin=true] {
						display: none;
					}
					&:hover {
						box-shadow: var(--hover-shadow);
					}
					> div[data-widget=plugin-node] {
						border: 0;
						&:before {
							display: none;
						}
						> span[data-widget=plugin-view-mode-label] {
							display: flex;
						}
						> div[data-widget=dropdown] {
							display: none;
						}
					}
					> span[data-widget=plugin-opener] {
						position: relative;
						border: 0;
						background-color: transparent;
						left: unset;
						clip-path : polygon(0 0, 0 100%, calc(100% + 1px) 100%, calc(100% + 1px) 0);
						&:before {
							display: none;
						}
						> span {
							border-width: var(--border-width);
						}
					}
					> span[data-widget=plugin-remover] {
						display: none;
					}
				} 
			}
		}
	}
	` : ''}
`;

export const PaletteColumn = styled.div.attrs({'data-widget': 'achievement-palette-column'})`
	display         : flex;
	position        : relative;
	flex-direction  : column;
	padding         : calc(var(--margin) * 2);
	align-items     : flex-start;
	justify-content : center;
`;

export const AchievementBlock = styled.div.attrs<{ error?: boolean; warn?: boolean }>(
	({error, warn}) => {
		return {
			'data-error': error ? 'true' : (void 0),
			'data-warn': warn ? 'true' : (void 0)
		};
	})<{ error?: boolean; warn?: boolean }>`
	display         : flex;
	position        : relative;
	align-items     : center;
	justify-content : center;
	min-height      : var(--header-height);
	min-width       : 150px;
	padding         : 0 var(--margin);
	border          : var(--border);
	border-width    : calc(var(--border-width) * 2);
	border-radius   : calc(var(--border-radius) * 2);
	border-color    : var(--primary-color);
	color           : var(--primary-color);
	font-size       : 1.2em;
	font-variant    : petite-caps;
	white-space     : nowrap;
	text-overflow   : ellipsis;
	overflow        : hidden;
	&[data-warn=true] {
		border-color : var(--warn-color);
		color        : var(--warn-color);
		&:before {
			background-color : var(--warn-color);
		}
		~ svg > g > path {
			stroke : var(--warn-color);
		}
	}
	&[data-error=true] {
		border-color : var(--danger-color);
		color        : var(--danger-color);
		&:before {
			background-color : var(--danger-color);
		}
		~ svg > g > path {
			stroke : var(--danger-color);
		}
	}
	&:before {
		content          : '';
		display          : block;
		position         : absolute;
		top              : 0;
		left             : 0;
		width            : 100%;
		height           : 100%;
		background-color : var(--primary-color);
		opacity          : 0.1;
		z-index          : -1;
	}
`;
export const AchievementBlockPairCurve = styled.svg.attrs<{ rect: CurveRect }>(({rect}) => {
	return {
		'xmlns': 'http://www.w3.org/2000/svg',
		style: {
			top: rect.top,
			left: 0 - rect.width,
			width: rect.width,
			height: rect.height
		}
	};
})<{ rect: CurveRect }>`
	display  : block;
	position : absolute;
	> g > path {
		stroke-width : 2px;
		fill         : transparent;
		opacity      : 0.5;
	}
`;
export const AchievementBlockPairLine = styled.span.attrs<{ error?: boolean; warn?: boolean }>(
	({error, warn}) => {
		return {
			'data-error': error ? 'true' : (void 0),
			'data-warn': warn ? 'true' : (void 0)
		};
	})<{ error?: boolean; warn?: boolean }>`
	&[data-warn=true] {
		background-color : var(--warn-color);
	}
	&[data-error=true] {
		background-color : var(--danger-color);
	}
`;

export const AchievementRootNode = styled(AchievementBlock).attrs({'data-widget': 'achievement-root-node'})`
	flex-direction : column;
	border-color   : var(--achievement-root-color);
	color          : var(--achievement-root-color);
	&:before {
		background-color : var(--achievement-root-color);
	}
	&:hover > div[data-widget=achievement-root-is-ratio] {
		opacity        : 1;
		pointer-events : auto;
	}
`;
export const AchievementRootName = styled.div.attrs({'data-widget': 'achievement-root-name'})`
	display         : flex;
	position        : relative;
	align-items     : center;
	justify-content : center;
	min-height      : var(--height);
	width           : 100%;
	font-weight     : var(--font-bold);
`;
export const AchievementRootScore = styled.div.attrs({'data-widget': 'achievement-root-score'})`
	display         : flex;
	position        : relative;
	align-items     : center;
	justify-content : center;
	min-height      : var(--height);
	width           : 100%;
	font-weight     : var(--font-bold);
`;
export const AchievementRootIsRatio = styled.div.attrs({'data-widget': 'achievement-root-is-ratio'})`
	display        : block;
	position       : absolute;
	bottom         : 2px;
	right          : 2px;
	opacity        : 0;
	pointer-events : none;
	transition     : opacity 300ms ease-in-out;
	> div[data-widget=checkbox] {
		border-color : var(--achievement-root-color);
	}
`;
export const IndicatorPartRelationLine = styled(AchievementBlockPairLine).attrs({'data-widget': 'indicator-part-relation-line'})`
	display          : block;
	position         : relative;
	width            : 64px;
	height           : 2px;
	background-color : var(--achievement-indicator-color);
	opacity          : 0.5;
`;
