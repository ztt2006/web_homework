import { loadData } from '../utils/dataLoader.js';

const chartInstances = {};

function createChartOption(chartType, data, theme) {
    const isDarkTheme = theme === 'dark';
    const textColor = isDarkTheme ? '#ccc' : '#333';
    const axisLineColor = isDarkTheme ? '#555' : '#ccc';
    const splitLineColor = isDarkTheme ? '#333' : '#eee';
    const accentColor = isDarkTheme ? '#0a84ff' : '#007aff';
    const secondaryAccentColor = isDarkTheme ? '#30d158' : '#2ecc71';

    switch (chartType) {
        case 'annualSales':
            return {
                tooltip: { formatter: '{a} <br/>{b} : {c}%' },
                series: [{
                    name: `年度销售额 (${data.year})`,
                    type: 'gauge',
                    min: 0,
                    max: 100, // Completion rate is a percentage
                    progress: { show: true, width: 18 },
                    axisLine: {
                        lineStyle: { width: 18 }
                    },
                    axisTick: { show: false },
                    splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
                    axisLabel: { distance: 25, color: textColor, fontSize: 12 },
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: 20,
                        itemStyle: { borderWidth: 5, borderColor: accentColor }
                    },
                    title: {
                        show: true,
                        offsetCenter: [0, '70%'],
                        fontSize: 14,
                        color: textColor
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: 24,
                        fontWeight: 'bold',
                        offsetCenter: [0, '50%'],
                        formatter: '{value}%',
                        color: accentColor
                    },
                    data: [{ value: data.completionRate, name: `目标: ${data.target.toLocaleString()}\n当前: ${data.current.toLocaleString()}` }]
                }]
            };
        case 'monthlySales':
            return {
                tooltip: { trigger: 'axis' },
                legend: { data: ['本年销售额', '去年销售额'], textStyle: { color: textColor }, top: 5 },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: data.months,
                    axisLine: { lineStyle: { color: axisLineColor } },
                    axisLabel: { color: textColor }
                },
                yAxis: {
                    type: 'value',
                    name: '销售额(万元)', // Assuming data is in 10k units
                    axisLine: { lineStyle: { color: axisLineColor } },
                    axisLabel: { color: textColor, formatter: '{value}' },
                    splitLine: { lineStyle: { color: splitLineColor } }
                },
                series: [
                    { name: '本年销售额', type: 'bar', data: data.currentYearSales, itemStyle: { color: accentColor } },
                    { name: '去年销售额', type: 'line', smooth: true, data: data.lastYearSales, itemStyle: { color: secondaryAccentColor } }
                ]
            };
        case 'conversionRate':
            return {
                tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" },
                legend: { data: data.map(item => item.name), textStyle: { color: textColor }, bottom: 10 },
                series: [{
                    name: '转化漏斗',
                    type: 'funnel',
                    left: '10%',
                    top: 30,
                    bottom: 60,
                    width: '80%',
                    min: 0,
                    max: data[0] ? data[0].value : 100, // Max is the first stage value
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    label: { show: true, position: 'inside', formatter: '{b}\n{c}', color: '#fff' },
                    labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
                    itemStyle: { borderColor: isDarkTheme ? '#2c2c2e' : '#fff', borderWidth: 1 },
                    emphasis: { label: { fontSize: 16 } },
                    data: data
                }]
            };
        case 'regionalSales':
            return {
                tooltip: { trigger: 'item' },
                legend: {
                    data: data.regions.map(r => r.name),
                    textStyle: { color: textColor },
                    bottom: 10,
                    type: 'scroll'
                },
                radar: {
                    indicator: data.indicator,
                    center: ['50%', '50%'],
                    radius: '65%',
                    name: { textStyle: { color: textColor } },
                    axisLine: { lineStyle: { color: axisLineColor } },
                    splitLine: { lineStyle: { color: splitLineColor } },
                    splitArea: { areaStyle: { color: isDarkTheme ? ['rgba(50,50,50,0.2)', 'rgba(80,80,80,0.2)'] : ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'] } }
                },
                series: [{
                    name: '各地区销售分析',
                    type: 'radar',
                    data: data.regions.map(region => ({
                        value: region.value,
                        name: region.name
                    }))
                }]
            };
        default:
            return {};
    }
}

async function initChart(chartId, dataPath, chartType, theme) {
    const chartDom = document.getElementById(chartId);
    if (!chartDom) {
        console.error(`Chart container with id "${chartId}" not found.`);
        return;
    }
    if (chartInstances[chartId]) {
        chartInstances[chartId].dispose();
        chartInstances[chartId] = null;
    }
    chartDom.innerHTML = '<div class="loading-placeholder">加载中...</div>';

    try {
        const data = await loadData(dataPath);
        const chart = echarts.init(chartDom, theme === 'dark' ? 'dark' : null);
        const option = createChartOption(chartType, data, theme);
        chart.setOption(option);
        chartInstances[chartId] = chart;
    } catch (error) {
        console.error(`Failed to initialize chart ${chartId}:`, error);
        chartDom.innerHTML = `<div class="error-placeholder">图表加载失败: ${error.message}</div>`;
    }
}

export function initSalesAnalysisCharts(theme) {
    initChart('annual-sales-chart', 'sales/annualSales.json', 'annualSales', theme);
    initChart('monthly-sales-chart', 'sales/monthlySales.json', 'monthlySales', theme);
    initChart('conversion-rate-chart', 'sales/conversionRate.json', 'conversionRate', theme);
    initChart('regional-sales-chart', 'sales/regionalSales.json', 'regionalSales', theme);
}

export function resizeSalesAnalysisCharts() {
    for (const chartId in chartInstances) {
        if (chartInstances[chartId]) {
            chartInstances[chartId].resize();
        }
    }
}