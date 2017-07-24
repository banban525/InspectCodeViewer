import { ComponentClass, Props, ReactElement } from 'react';
import { EventEmitter } from 'events';

export interface AreaChartProps extends Props<AreaChart> {
  /**
   * The layout of area in the chart. DEFAULT: 'horizontal'
  */
  layout?: 'horizontal' | 'vertical';
  /**
   * If any two categorical charts(LineChart, AreaChart, BarChart, ComposedChart) have the same syncId, these two charts can sync the position tooltip, and the startIndex, endIndex of Brush.
  */
  syncId?: string;
  /**
   * The width of chart container.
  */
  width?:Number;
  /**
   * The height of chart container.
  */
  height?:Number;
  /**
   * The source data, in which each element is an object.
  */
  data:any[];
  /**
   * The sizes of whitespace around the container. DEFAULT: { top: 5, right: 5, bottom: 5, left: 5 }
  */
  margin?:any;
  /**
   * The type of offset function used to generate the lower and upper values in the series array. The four types are built-in offsets in d3-shape.
   * DEFAULT: 'none'
  */
  stackOffset?: 'expand' | 'none' | 'wiggle' | 'silhouette';
  /**
   * The base value of area.
   * DEFAULT: auto
  */
  baseValue?: Number | 'dataMin' | 'dataMax' | 'auto';
  /**
   * The customized event handler of click in this chart.
  */
  onClick?: ()=>void;
  /**
   * The customized event handler of mouseenter in this chart.
  */
  onMouseEnter?: ()=>void;
  /**
   * The customized event handler of mousemove in this chart.
  */
  onMouseMove?: ()=>void;
  /**
   * The customized event handler of mouseleave in this chart.
  */
  onMouseLeave?: ()=>void;
}


export interface AreaChart extends ComponentClass<AreaChartProps> {
}
interface AreaChart extends ComponentClass<AreaChartProps> { }
declare const AreaChart: AreaChart;

export interface AreaProps extends Props<Area>{
  /**
   * The interpolation type of area. And customized interpolation function can be set to type.
   * DEFAULT: 'linear'
  */
  type?: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' |  (()=>any);
  /**
   * The key of a group of data which should be unique in an area chart.
  */
  dataKey?:String | Number;
  /**
   * The id of x-axis which is corresponding to the data.
   * DEFAULT: 0
  */
  xAxisId?: String | Number;
  /**
   * The id of y-axis which is corresponding to the data.
   * DEFAULT: 0
  */
  yAxisId?: String | Number;
  /**
   * The type of icon in legend. If set to 'none', no legend item will be rendered.
   * DEFAULT: 'line'
  */
  legendType?: 'line' | 'square' | 'rect'| 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye' | 'none';
  /**
   * 
  */
  dot?: boolean | any | ReactElement<any> | (()=>any);
  /**
   * If false set, dots will not be drawn. If true set, dots will be drawn which have the props calculated internally. If object set, dots will be drawn which have the props mergered by the internal calculated props and the option. If ReactElement set, the option can be the custom dot element. If set a function, the function will be called to render customized dot.
   * DEFAULT: false
  */
  activeDot?: boolean | any | ReactElement<any> | (()=>any);
  /**
   * The dot is shown when muser enter a area chart and this chart has tooltip. If false set, no active dot will not be drawn. If true set, active dot will be drawn which have the props calculated internally. If object set, active dot will be drawn which have the props mergered by the internal calculated props and the option. If ReactElement set, the option can be the custom active dot element.If set a function, the function will be called to render customized active dot.
   * DEFAULT: true
  */
  label?: boolean | Object | ReactElement<any> | (()=>any);
  /**
   * If false set, labels will not be drawn. If true set, labels will be drawn which have the props calculated internally. If object set, labels will be drawn which have the props mergered by the internal calculated props and the option. If ReactElement set, the option can be the custom label element. If set a function, the function will be called to render customized label.
   * DEFAULT: false
  */
  stroke?: string;
  /**
   * If false "none", not stroke curve will be drawn.
   * DEFAULT: #3182bd
  */
  layout?: 'horizontal' | 'vertical';
  /**
   * The layout of area, usually inherited from parent.
  */
  baseLine?: number | any[];
  /**
   * The value which can describle the line, usually calculated internally.
  */
  points?: any[];
  /**
   * The coordinates of all the points in the area, usually calculated internally.
  */
  stackId?: string | Number;
  /**
   * The stack id of area, when two areas have the same value axis and same stackId, then the two areas area stacked in order.
  */
  connectNulls?: boolean;
  /**
   * Whether to connect a graph area across null points.
   * DEFAULT: false
  */
  unit?: string | Number;
  /**
   * The unit of data. This option will be used in tooltip.
  */
  name?: string | Number;
  /**
   * If set false, animation of area will be disabled.
   * DEFAULT: true in CSR, and false in SSR
  */
  isAnimationActive?: boolean;
  /**
   * Specifies when the animation should begin, the unit of this option is ms.
  */
  animationBegin?: Number;
  /**
   * Specifies the duration of animation, the unit of this option is ms.
   * DEFAULT: 1500
  */
  animationDuration?: Number;
  /**
   * The type of easing function.
   * DEFAULT: 'ease'
  */
  animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  /**
   * The customized event handler of click on the area in this group
  */
  onClick?: ()=>void;
  /**
   * The customized event handler of mousedown on the area in this group
  */
  onMouseDown?: ()=>void;
  /**
   * The customized event handler of mouseup on the area in this group
  */
  onMouseUp?: ()=>void;
  /**
   * The customized event handler of mousemove on the area in this group
  */
  onMouseMove?: ()=>void;
  /**
   * The customized event handler of mouseover on the area in this group
  */
  onMouseOver?: ()=>void;
  /**
   * The customized event handler of mouseout on the area in this group
  */
  onMouseOut?: ()=>void;
  /**
   * The customized event handler of moustenter on the area in this group
  */
  onMouseEnter?: ()=>void;
  /**
   * The customized event handler of mouseleave on the area in this group
  */
  onMouseLeave?: ()=>void;

  fill?:string;
}
export interface Area extends ComponentClass<AreaProps> {
}
interface Area extends ComponentClass<AreaProps> { }
declare const Area: Area;


export interface BarChartProps extends Props<BarChart> {
  /**
   * The layout of bars in the chart.
   * DEFAULT: 'horizontal'
  */
  layout: 'horizontal' | 'vertical';
  /**
   * If any two categorical charts(LineChart, AreaChart, BarChart, ComposedChart) have the same syncId, these two charts can sync the position tooltip, and the startIndex, endIndex of Brush.
  */
  syncId?: string;
  /**
   * The width of chart container.
  */
  width:Number;
  /**
   * The height of chart container.
  */
  height:Number;
  /**
   * The source data, in which each element is an object.
  */
  data:any[];
  /**
   * The sizes of whitespace around the container.
   * DEFAULT: { top: 5, right: 5, bottom: 5, left: 5 }
  */
  margin:any;

  /**
   * The gap between two bar categories, which can be a percent value or a fixed value.
   * DEFAULT: '10%'
  */
  barCategoryGap: string | Number;
  /**
   * The gap between two bars in the same category.
   * DEFAULT: 4
  */
  barGap: string | Number;
  /**
   * The width or height of each bar. If the barSize is not specified, the size of the bar will be calculated by the barCategoryGap, barGap and the quantity of bar groups.
  */
  barSize: Number;
  /**
   * The maximum width of all the bars in a horizontal BarChart, or maximum height in a vertical BarChart.
  */
  maxBarSize: Number;

  /**
   * The type of offset function used to generate the lower and upper values in the series array. The four types are built-in offsets in d3-shape.
   * DEFAULT: 'none'
  */
  stackOffset: 'expand' | 'none' | 'wiggle' | 'silhouette';
  /**
   * The customized event handler of click in this chart.
  */
  onClick?: ()=>void;
  /**
   * The customized event handler of mouseenter in this chart.
  */
  onMouseEnter?: ()=>void;
  /**
   * The customized event handler of mousemove in this chart.
  */
  onMouseMove?: ()=>void;
  /**
   * The customized event handler of mouseleave in this chart.
  */
  onMouseLeave?: ()=>void;
}


export interface BarChart extends ComponentClass<BarChartProps> {
}
interface BarChart extends ComponentClass<BarChartProps> { }
declare const BarChart: BarChart;

export interface BarProps extends Props<Bar>
{
  /**
   * The layout of bar in the chart, usually inherited from parent.
  */
  layout? : 'horizontal' | 'vertical';
  /**
   * The key of a group of data which should be unique in an area chart.

  */
  dataKey?: String | Number;
  xAxisId?: String | Number;
  yAxisId?: String | Number;
  legendType?: 'line' | 'square' | 'rect'| 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye' | 'none';
  label?: Boolean | any | ReactElement<any> | (()=>any);
  data?: any[];
  barSize?: Number;
  maxBarSize?: Number;
  minPointSize?: Number;
  shape?: ReactElement<any> | (()=>any);
  stackId?: String | Number;
  unit?: String | Number;
  name?: String | Number;
  isAnimationActive?: Boolean;
  animationBegin?: Number;
  animationDuration?: Number;
  animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  onClick?: ()=>void;
  onMouseDown?: ()=>void;
  onMouseUp?: ()=>void;
  onMouseMove?: ()=>void;
  onMouseOver?: ()=>void;
  onMouseOut?: ()=>void;
  onMouseEnter?: ()=>void;
  onMouseLeave?: ()=>void;
  fill?:string;
}

export interface Bar extends ComponentClass<BarProps> {
}
interface Bar extends ComponentClass<BarProps> { }
declare const Bar: Bar;



export interface LineChartProps extends Props<LineChart> {
  layout: 'horizontal' | 'vertical';
  syncId?: string;
  width:Number;
  height:Number;
  data:any[];
  margin:any;


  onClick?: ()=>void;
  onMouseEnter?: ()=>void;
  onMouseMove?: ()=>void;
  onMouseLeave?: ()=>void;
}


export interface LineChart extends ComponentClass<LineChartProps> {
}
interface LineChart extends ComponentClass<LineChartProps> { }
declare const LineChart: LineChart;

export interface LineProps extends Props<Line>{
  type: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' | (()=>any);
  dataKey: String | Number;
  xAxisId: String | Number;
  yAxisId: String | Number;
  legendType?: 'line' | 'square' | 'rect'| 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye' | 'none';
  dot: Boolean | any | ReactElement<any> | (()=>any);
  activeDot: Boolean | any | ReactElement<any> | (()=>any);
  label: Boolean | any | ReactElement<any> | (()=>any);
  points: any[];
  layout?: 'horizontal' | 'vertical';
  connectNulls: Boolean;
  unit?: String | Number;
  name?: String | Number;
  isAnimationActive: Boolean;
  animationBegin: Number;
  animationDuration: Number;
  animationEasing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  onClick?: ()=>void;
  onMouseDown?: ()=>void;
  onMouseUp?: ()=>void;
  onMouseMove?: ()=>void;
  onMouseOver?: ()=>void;
  onMouseOut?: ()=>void;
  onMouseEnter?: ()=>void;
  onMouseLeave?: ()=>void;
}

export interface Line extends ComponentClass<LineProps> {
}
interface Line extends ComponentClass<LineProps> { }
declare const Line: Line;

export interface XAxisProps extends Props<XAxis>{
  hide?: Boolean;
  dataKey?: String | Number;
  xAxisId?:String | Number;
  width?:Number;
  height?:Number;
  orientation?: 'bottom'|'top';
  type?:'number' | 'category';
  allowDecimals?: Boolean;
  allowDataOverflow?: Boolean;
  tickCount?: Number;
  domain?: any[];
  interval?: "preserveStart" | "preserveEnd" | "preserveStartEnd" | Number;
  padding?: any;
  minTickGap?: Number;
  axisLine?: Boolean | any;
  tickLine?: Boolean | any;
  tickSize?: Number;
  tickFormatter?: (d:any)=>any;
  ticks?:any[];
  tick?: Boolean | any | ReactElement<any>
  mirror?: Boolean;
  reversed?: Boolean;
  label?: String | Number | ReactElement<any>;
  scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utcTime' | 'sequential' | 'threshold' | (()=>any)
  unit?: String | Number;
  name?: String | Number;
  onClick?: ()=>void;
  onMouseDown?: ()=>void;
  onMouseUp?: ()=>void;
  onMouseMove?: ()=>void;
  onMouseOver?: ()=>void;
  onMouseOut?: ()=>void;
  onMouseEnter?: ()=>void;
  onMouseLeave?: ()=>void;
}
export interface XAxis extends ComponentClass<XAxisProps> {
}
interface XAxis extends ComponentClass<XAxisProps> { }
declare const XAxis: XAxis;


export interface YAxisProps extends Props<YAxis>{
  hide?: Boolean;
  dataKey?: String | Number;
  yAxisId?:String | Number;
  width?:Number;
  height?:Number;
  orientation?: 'bottom'|'top';
  domain?: any[];
  interval?: "preserveStart" | "preserveEnd" | "preserveStartEnd" | Number;
  padding?: any;
  minTickGap?: Number;
  axisLine?: Boolean | any;
  tickLine?: Boolean | any;
  tickSize?: Number;
  tickFormatter?: (d:any)=>any;
  ticks?:any[];
  tick?: Boolean | any | ReactElement<any>
  mirror?: Boolean;
  reversed?: Boolean;
  label?: String | Number | ReactElement<any>;
  scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utcTime' | 'sequential' | 'threshold' | (()=>any)
  unit?: String | Number;
  name?: String | Number;
  onClick?: ()=>void;
  onMouseDown?: ()=>void;
  onMouseUp?: ()=>void;
  onMouseMove?: ()=>void;
  onMouseOver?: ()=>void;
  onMouseOut?: ()=>void;
  onMouseEnter?: ()=>void;
  onMouseLeave?: ()=>void;
}
export interface YAxis extends ComponentClass<YAxisProps> {
}
interface YAxis extends ComponentClass<YAxisProps> { }
declare const YAxis: YAxis;

export interface CartesianGridProps extends Props<CartesianGrid>{
  x?: Number;
  y?: Number;
  width?: Number;
  height?: Number;
  horizontal?: Boolean;
  vertical?: Boolean;
  horizontalPoints?: any[];
  verticalPoints?: any[];
  strokeDasharray?:string;
}

export interface CartesianGrid extends ComponentClass<CartesianGridProps> {
}
interface CartesianGrid extends ComponentClass<CartesianGridProps> { }
declare const CartesianGrid: CartesianGrid;




export interface TooltipProps extends Props<Tooltip>{
  separator?: String;
  offset?: Number;
  itemStyle?: any;
  wrapperStyle?: any;
  labelStyle?: any;
  cursor?: Boolean | any | ReactElement<any>;
  viewBox?: any;
  active?: Boolean;
  coordinate?: any;
  payload?: any;
  label?: String | Number;
  content?: ReactElement<any> | (()=>void);
  formatter?: (d:any)=>any;
  labelFormatter?: (d:any)=>any;
  itemSorter?: ()=>any;
  isAnimationActive?:Boolean;
  animationBegin?: Number;
  animationDuration?: Number;
  animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

export interface Tooltip extends ComponentClass<TooltipProps> {
}
interface Tooltip extends ComponentClass<TooltipProps> { }
declare const Tooltip: Tooltip;





export interface ComposedChartProps extends Props<ComposedChartProps> {
  /**
   * The layout of bars in the chart.
   * DEFAULT: 'horizontal'
  */
  layout?: 'horizontal' | 'vertical';
  /**
   * If any two categorical charts(LineChart, AreaChart, BarChart, ComposedChart) have the same syncId, these two charts can sync the position tooltip, and the startIndex, endIndex of Brush.
  */
  syncId?: string;
  /**
   * The width of chart container.
  */
  width?:Number;
  /**
   * The height of chart container.
  */
  height?:Number;
  /**
   * The source data, in which each element is an object.
  */
  data:any[];
  /**
   * The sizes of whitespace around the container.
   * DEFAULT: { top: 5, right: 5, bottom: 5, left: 5 }
  */
  margin?:any;

  /**
   * The gap between two bar categories, which can be a percent value or a fixed value.
   * DEFAULT: '10%'
  */
  barCategoryGap?: string | Number;
  /**
   * The gap between two bars in the same category.
   * DEFAULT: 4
  */
  barGap?: string | Number;
  /**
   * The width or height of each bar. If the barSize is not specified, the size of the bar will be calculated by the barCategoryGap, barGap and the quantity of bar groups.
  */
  barSize?: Number;

  /**
   * The customized event handler of click in this chart.
  */
  onClick?: ()=>void;
  /**
   * The customized event handler of mouseenter in this chart.
  */
  onMouseEnter?: ()=>void;
  /**
   * The customized event handler of mousemove in this chart.
  */
  onMouseMove?: ()=>void;
  /**
   * The customized event handler of mouseleave in this chart.
  */
  onMouseLeave?: ()=>void;
}


export interface ComposedChart extends ComponentClass<ComposedChartProps> {
}
interface ComposedChart extends ComponentClass<ComposedChartProps> { }
declare const ComposedChart: ComposedChart;
